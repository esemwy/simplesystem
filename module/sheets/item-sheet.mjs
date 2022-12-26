/**
 * Extend the basic ItemSheet with some very simple modifications
 * @extends {ItemSheet}
 */
export class simplesystemItemSheet extends ItemSheet {

  /** @override */
  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ["simplesystem", "sheet", "item"],
      width: 520,
      height: 480,
      tabs: [{ navSelector: ".sheet-tabs", contentSelector: ".sheet-body", initial: "description" }]
    });
  }

  /** @override */
  get template() {
    const path = "systems/simplesystem/templates/item";

    // Alternatively, you could use the following return statement to do a
    // unique item sheet by type, like `weapon-sheet.html`.
    return `${path}/item-${this.item.type}-sheet.html`;
  }

  /* -------------------------------------------- */

  /** @override */
  getData() {
    // Retrieve base data structure.
    const context = super.getData();

    // Use a safe clone of the item data for further operations.
    const itemData = context.item;

    // Retrieve the roll data for TinyMCE editors.
    context.rollData = {};
    context.abilities = {};
    let actor = this.object?.parent ?? null;

    // Prepare character data and items.
    if ((itemData.type == 'weapon') || (itemData.type == 'tool')) {
      this._prepareItems(context);
    }

    if (actor) {
      context.rollData = actor.getRollData();
    }

    Object.keys(game.model.Actor.character.abilities).forEach((key) => {
      context.abilities[key] = game.i18n.localize(CONFIG.SS.abilities[key]) ?? key;;
    });

    // Add the actor's data to context.data for easier access, as well as flags.
    context.system = itemData.system;
    context.flags = itemData.flags;

    return context;
  }


  /**
   * Organize and classify Items for Character sheets.
   *
   * @param {Object} actorData The actor to prepare.
   *
   * @return {undefined}
   */
  _prepareItems(context) {
    // Initialize containers.
    // const proficiencies = [];

    // Iterate through items, allocating to containers
    // for (let i of context.items) {
    //   i.img = i.img || DEFAULT_TOKEN;
    //   // Append to gear.
    //   if (i.type === 'proficiency') {
    //     proficiencies.push(i);
    //   }
    // }
  }
  /* -------------------------------------------- */

  /** @override */
  activateListeners(html) {
    super.activateListeners(html);

    // Render the item sheet for viewing/editing prior to the editable check.
    html.find('.item-edit').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      console.log('.item', $(ev.currentTarget).parents(".item"));
      //const item = this.item.system.get(li.data("itemId"));
      //item.sheet.render(true);
    });

    // -------------------------------------------------------------
    // Everything below here is only needed if the sheet is editable
    if (!this.isEditable) return;

    // Add Inventory Item
    html.find('.item-create').click(this._onItemCreate.bind(this));

    // Delete Inventory Item
    html.find('.item-delete').click(ev => {
      const li = $(ev.currentTarget).parents(".item");
      console.log('ev', ev);

      // const item = this.item.system.proficiencies.get(li.data("itemId"));
      // item.delete();
      // li.slideUp(200, () => this.render(false));
    });

    // Drag events for macros.
    if (this.item.isOwner) {
      let handler = ev => this._onDragStart(ev);
      html.find('li.item').each((i, li) => {
        if (li.classList.contains("inventory-header")) return;
        li.setAttribute("draggable", true);
        li.addEventListener("dragstart", handler, false);
      });
    }
  }

  /**
   * Handle creating a new Owned Item for the actor using initial data defined in the HTML dataset
   * @param {Event} event   The originating click event
   * @private
   */
  async _onItemCreate(event) {
    event.preventDefault();
    const header = event.currentTarget;
    // Get the type of item to create.
    const type = header.dataset.type;
    // Grab any data associated with this control.
    const data = duplicate(header.dataset);
    // Initialize a default name.
    const name = `New ${type.capitalize()}`;
    // Prepare the item object.
    const itemData = {
      name: name,
      type: type,
      system: data
    };
    // Remove the type from the dataset since it's in the itemData.type prop.
    //delete itemData.system["type"];

    // Finally, create the item!
    // return await Item.create(itemData, {parent: this.item.system.proficiencies});
    let proficiencies = this.item.system.proficiencies;
    if (proficiencies === undefined) proficiencies = [];
    proficiencies.push(itemData);
    return this.item.update({
      "system.proficiencies": proficiencies
    });
  }
}