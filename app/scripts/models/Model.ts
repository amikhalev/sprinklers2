import * as _ from 'lodash';

/**
 * A base class for all models. Provides a few helper methods for converting
 * to/from JS objects. Sub classes must define a static variable called props
 * which is a list of all properties to convert to/from json.
 * @param T The type of the parent store of the model.
 */
export default class Model {
  static props:Array<string>;

  /**
   * The immutable id of the model
   * @type {number}
   */
  id:number = -1;

  /**
   * Creates a new model instance
   * @param id The id of the model
   */
  constructor(id:number) {
    this.id = id;
  }

  /**
   * Updates the values of this Section from json, probably received from the server.
   * @param json The json content to apply
   */
  updateFromJson(json:Object) {
    const Constructor:any = this.constructor;
    _.assign(this, _.pick(json, Constructor.props));
  }

  /**
   * Converts this model instance to json
   * @return The json
   */
  toJson():any {
    const Constructor:any = this.constructor;
    return _.pick(this, Constructor.props);
  }

  /**
   * Creates a new Model instance from json
   * @param store {*} The parent store of this Model
   * @param json {Object} The json to create the model from
   * @return {*} The model instance of the same type as the subclass.
   */
  static fromJson(store, json):any {
    if (!json.id) {
      throw new Error('JSON for creating model must contain property id');
    }
    const Constructor:any = this;
    const model = new Constructor(store, json.id);
    model.updateFromJson(json);
    return model;
  }
}