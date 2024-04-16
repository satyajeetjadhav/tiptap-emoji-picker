import { CompactEmoji } from "emojibase";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

interface EmojiProps {
  items: CompactEmoji[];
  command: ({ id }) => void;
}

export default forwardRef((props: EmojiProps, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index: number) => {
    const item = props.items[index];

    if (item) {
      const storedEmojis = localStorage.getItem("emojis");
      if (storedEmojis) {
        const emojis = JSON.parse(storedEmojis) as CompactEmoji[];
        /* Add the item to the emojis. ensure length of emojis doesn't exceed 5. If it exceeds 5, remove the first emoji. */
        //insert the emoji at the beginning of the array
        emojis.unshift(item);
        localStorage.setItem("emojis", JSON.stringify(emojis.slice(0, 5)));
      } else {
        localStorage.setItem("emojis", JSON.stringify([item]));
      }
      props.command({ id: item.unicode });
      // call the command so that it replaces the : with the emoji
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => {
    setSelectedIndex(0);
  }, [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowLeft") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowRight") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  if (props.items) {
    return (
      <div className="bg-slate-200 dark:bg-slate-700 dark:text-slate-200 text-slate-700 rounded-md shadow-md p-2 flex flex-row flex-wrap text-2x max-w-sm overflow-hidden">
        {props.items.length ? (
          props.items.map((item, index) => (
            <button
              className={`py-1 px-2 ${
                index === selectedIndex
                  ? "border border-slate-400 dark:border-slate-600"
                  : ""
              }`}
              key={index}
              onClick={() => selectItem(index)}
            >
              {item.unicode}
            </button>
          ))
        ) : (
          <div className="item">No result</div>
        )}
      </div>
    );
  }
});
