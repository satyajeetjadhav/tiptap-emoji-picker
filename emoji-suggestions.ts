import { ReactRenderer } from "@tiptap/react";
import { CompactEmoji } from "emojibase";
import { fetchEmojis } from "emojibase";

import tippy from "tippy.js";
import emojiList from "./emoji-list";

interface QueryProps {
  query: string;
}

export default {
  items: async ({ query }: QueryProps) => {
    const compactEmojis = await fetchEmojis("en", { compact: true });
    if (query !== "") {
      const results = compactEmojis.filter((emoji: CompactEmoji) => {
        if (emoji.label.includes(query)) {
          return true;
        } else if (emoji.tags) {
          return emoji.tags!.some((tag) => {
            /* check if the query is contained in the tag */
            return tag.includes(query);
          });
        }
      });
      return results.slice(0, 20);
    } else {
      const localEmojis = localStorage.getItem("emojis");
      if (localEmojis) {
        return JSON.parse(localEmojis);
      } else {
        return [];
      }
    }
  },

  char: ":",

  render: () => {
    let component;
    let popup;

    return {
      onStart: (props) => {
        component = new ReactRenderer(emojiList, {
          props,
          editor: props.editor,
        });

        if (!props.clientRect) {
          return;
        }

        popup = tippy("body", {
          getReferenceClientRect: props.clientRect,
          appendTo: () => document.body,
          content: component.element,
          showOnCreate: true,
          interactive: true,
          trigger: "manual",
          placement: "bottom-start",
        });
      },

      onUpdate(props) {
        component.updateProps(props);

        if (!props.clientRect) {
          return;
        }

        popup[0].setProps({
          getReferenceClientRect: props.clientRect,
        });
      },

      onKeyDown(props) {
        if (props.event.key === "Escape") {
          popup[0].hide();

          return true;
        }

        return component.ref?.onKeyDown(props);
      },

      onExit() {
        setTimeout(() => {
          popup[0].destroy();
          component.destroy();
        });
      },
    };
  },
};
