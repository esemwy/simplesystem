/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
 export const preloadHandlebarsTemplates = async function() {
  return loadTemplates([

    // Actor partials.
    "systems/simplesystem/templates/actor/parts/actor-proficiencies.html",
    "systems/simplesystem/templates/actor/parts/actor-equipment.html",
    "systems/simplesystem/templates/actor/parts/actor-main.html",
  ]);
};
