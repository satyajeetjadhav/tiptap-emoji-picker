# 🚀 Emoji picker for tiptap 🗒️ 

The official tiptap emoji picker extension is a pro extension. Meaning you have to pay for using it. It is easy enought to build this extension by extending the existing Mention plugin from tiptap.

The key is to use the Mention node with a custom suggestion utility. 

```
          Mention.configure({
            renderHTML({ options, node }) {
              return [
                "span",
                this.HTMLAttributes,
                `${node.attrs.label ?? node.attrs.id}`,
              ];
            },
            HTMLAttributes: {
              class: "mention",
            },
            suggestion: emoji_suggestion,
          }),
```
The suggestion utility expects a few functions, and properties. For the most part, you can use the suggestion utility described in the tiptap example here. 

The part that needs to change for rendering emojis, is the items function and the render function.

## items

Here the items function, is getting the complete list of emojis from a library called emojibase.dev.  This is an amazing library with clear documentation. The function then returns a subset of emojis based on the user’s query.

It also returns the last 5 emojis from the `localstorage` as soon as the user types the `:` character.
```
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
...
}
```
## render

The render function renders the `emoji-list.tsx` component. This is a snippet of code from the component.
```
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
```
