namespace Factory {
  export type ElementAttributes = Record<string, string>;

  export const create = (tagName: string, attributes?: ElementAttributes, children?: Node[]) => {
    const element = document.createElement(tagName);

    if (attributes) {
      for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
      }
    }

    if (children) {
      for (const child of children) {
        element.append(child);
      }
    }

    return element;
  };
}
