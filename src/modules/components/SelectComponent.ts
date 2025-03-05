namespace Component {
  interface Component {
    readonly parentElement: HTMLElement;
    delete: () => void;
  }

  type SelectComponentProps = Factory.ElementAttributes & {
    parentElement: HTMLElement;
    name: string;
    id: string;
    options: string[];
    onInput: (value: string) => unknown;
  };

  interface SelectComponentInstanceProps
    extends Pick<SelectComponentProps, "parentElement" | "name" | "id"> {
    selectElement: HTMLSelectElement;
    abortController: AbortController;
  }

  export class SelectComponent implements Component {
    readonly element: HTMLSelectElement;
    readonly parentElement: HTMLElement;
    readonly name: string;
    readonly id: string;
    private abortController: AbortController;

    private constructor({
      selectElement,
      parentElement,
      name,
      id,
      abortController,
    }: SelectComponentInstanceProps) {
      this.element = selectElement;
      this.parentElement = parentElement;
      this.name = name;
      this.id = id;
      this.abortController = abortController;
    }

    static createElement({
      parentElement,
      name,
      id,
      options,
      onInput,
      ...attributes
    }: SelectComponentProps) {
      const optionElements = this.createOptions(options);
      const selectElement = <HTMLSelectElement>(
        Factory.create("select", { name, id, ...attributes }, optionElements)
      );
      const abortController = new AbortController();
      selectElement.addEventListener(
        "input",
        (event: Event) => {
          if (event.currentTarget instanceof HTMLSelectElement) {
            return onInput(event.currentTarget.value);
          }
          throw new Error(
            `SelectComponent ~ onInput: event.currentTarget is not instance of HTMLSelectElement`,
          );
        },
        { signal: abortController.signal },
      );

      const selectComponent = new SelectComponent({
        parentElement,
        selectElement,
        name,
        id,
        abortController,
      });
      return selectComponent;
    }

    private static createOptions(options: string[]) {
      const optionElements = [];
      for (let option of options) {
        const optionElement = document.createElement("option");
        optionElement.value = option;
        optionElement.innerText = option;
        optionElements.push(optionElement);
      }
      return optionElements;
    }

    delete() {
      this.abortController.abort();
      this.element.remove();
    }
  }
}
