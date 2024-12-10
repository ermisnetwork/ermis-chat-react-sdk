import type { ChannelFilters, ChannelOptions, ChannelSort } from 'ermis-chat-js-sdk';

/**
 *
 * @param disableChannelNameFilter set it to true if you want to see all channels where the given user is a member.
 * @param user the user id.
 */
export const getChannelListOptions = () => {
  // const filters: ChannelFilters = disableChannelNameFilter
  //   ? { type: 'messaging', members: { $in: [user!] } }
  //   : { type: 'messaging', name: 'Social Demo', demo: 'social' };

  // const options: ChannelOptions = { state: true, watch: true, presence: true, limit: 8 };

  // const sort: ChannelSort = {
  //   last_message_at: -1,
  //   updated_at: -1,
  // };

  const filters: ChannelFilters = {
    // type: 'messaging',
    // roles: ['owner', 'moder', 'member'],
  };
  const options: ChannelOptions = { message_limit: 25 };
  const sort: ChannelSort = { last_message_at: -1 };

  return {
    filters,
    options,
    sort,
  };
};
