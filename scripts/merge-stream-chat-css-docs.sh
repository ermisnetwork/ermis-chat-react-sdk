#!/usr/bin/env bash

usage() {
  echo "Missing path to ermis-chat-css directory"
  echo "Usage: $(basename $0) <path_to_ermis-chat-css_directory>"
}

main() {
  if [ $# -eq 0 ]; then
      usage
      exit 1
  fi

  STREAM_CHAT_CSS_DOCS_PATH=$1;
  cp -r "$STREAM_CHAT_CSS_DOCS_PATH"/* ./docusaurus/docs/React;
}


main $*
exit 0
