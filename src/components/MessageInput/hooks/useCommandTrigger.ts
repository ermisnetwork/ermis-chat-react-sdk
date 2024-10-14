import { CommandItem } from '../../CommandItem/CommandItem';

import { useChannelStateContext } from '../../../context/ChannelStateContext';
import { useChatContext } from '../../../context/ChatContext';
import { useTranslationContext } from '../../../context';

import type { CommandResponse } from 'stream-chat';

import type { CommandTriggerSetting } from '../DefaultTriggerProvider';

import type { DefaultErmisChatGenerics } from '../../../types/types';

type ValidCommand<
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
> = Required<Pick<CommandResponse<ErmisChatGenerics>, 'name'>> &
  Omit<CommandResponse<ErmisChatGenerics>, 'name'>;

export const useCommandTrigger = <
  ErmisChatGenerics extends DefaultErmisChatGenerics = DefaultErmisChatGenerics
>(): CommandTriggerSetting<ErmisChatGenerics> => {
  const { themeVersion } = useChatContext<ErmisChatGenerics>('useCommandTrigger');
  const { channelConfig } = useChannelStateContext<ErmisChatGenerics>('useCommandTrigger');
  const { t } = useTranslationContext('useCommandTrigger');

  const commands = channelConfig?.commands;

  return {
    component: CommandItem,
    dataProvider: (query, text, onReady) => {
      if (text.indexOf('/') !== 0 || !commands) {
        return [];
      }
      const selectedCommands = commands.filter((command) => command.name?.indexOf(query) !== -1);

      // sort alphabetically unless you're matching the first char
      selectedCommands.sort((a, b) => {
        let nameA = a.name?.toLowerCase();
        let nameB = b.name?.toLowerCase();
        if (nameA?.indexOf(query) === 0) {
          nameA = `0${nameA}`;
        }
        if (nameB?.indexOf(query) === 0) {
          nameB = `0${nameB}`;
        }
        // Should confirm possible null / undefined when TS is fully implemented
        if (nameA != null && nameB != null) {
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
        }

        return 0;
      });

      const result = selectedCommands.slice(0, themeVersion === '2' ? 5 : 10);
      if (onReady)
        onReady(
          result
            .filter(
              (result): result is CommandResponse<ErmisChatGenerics> & { name: string } =>
                result.name !== undefined,
            )
            .map((commandData) => {
              const translatedCommandData: ValidCommand<ErmisChatGenerics> = {
                name: commandData.name,
              };

              if (commandData.args)
                translatedCommandData.args = t(`${commandData.name}-command-args`, {
                  defaultValue: commandData.args,
                });
              if (commandData.description)
                translatedCommandData.description = t(`${commandData.name}-command-description`, {
                  defaultValue: commandData.description,
                });

              return translatedCommandData;
            }),
          query,
        );

      return result;
    },
    output: (entity) => ({
      caretPosition: 'next',
      key: entity.name,
      text: `/${entity.name}`,
    }),
  };
};
