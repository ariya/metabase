// NOTE: this needs to be imported first due to some cyclical dependency nonsense
import Question from "../Question";

import Base from "./Base";
import Database from "./Database";
import Schema from "./Schema";
import Field from "./Field";

import Dimension from "../Dimension";

import { singularize } from "metabase/lib/formatting";
import { getAggregationOperatorsWithFields } from "metabase/lib/schema_metadata";
import { memoize, createLookupByProperty } from "metabase-lib/lib/utils";

/** This is the primary way people interact with tables */
export default class Table extends Base {
  hasSchema() {
    return (this.schema_name && this.db && this.db.schemas.length > 1) || false;
  }

  // Could be replaced with hydrated database property in selectors/metadata.js (instead / in addition to `table.db`)
  get database() {
    return this.db;
  }

  /**
   * @returns {Question}
   */
  newQuestion() {
    return this.question()
      .setDefaultQuery()
      .setDefaultDisplay();
  }

  /**
   * @returns {Question}
   */
  question() {
    return Question.create({
      databaseId: this.db && this.db.id,
      tableId: this.id,
      metadata: this.metadata,
    });
  }

  isSavedQuestion() {
    return this.savedQuestionId() !== null;
  }

  savedQuestionId() {
    const match = String(this.id).match(/card__(\d+)/);
    return match ? parseInt(match[1]) : null;
  }

  /**
   * @returns {StructuredQuery}
   */
  query(query = {}) {
    return this.question()
      .query()
      .updateQuery(q => ({ ...q, ...query }));
  }

  /**
   * @returns {Dimension[]}
   */
  dimensions() {
    return this.fields.map(field => field.dimension());
  }

  displayName({ includeSchema } = {}) {
    return (
      (includeSchema && this.schema ? this.schema.displayName() + "." : "") +
      this.display_name
    );
  }

  /**
   * The singular form of the object type this table represents
   * Currently we try to guess this by singularizing `display_name`, but ideally it would be configurable in metadata
   * See also `field.targetObjectName()`
   */
  objectName() {
    return singularize(this.displayName());
  }

  /**
   * @returns {Field[]}
   */
  dateFields() {
    return this.fields.filter(field => field.isDate());
  }

  // AGGREGATIONS

  @memoize
  aggregationOperators() {
    return getAggregationOperatorsWithFields(this);
  }

  @memoize
  aggregationOperatorsLookup() {
    return createLookupByProperty(this.aggregationOperators(), "short");
  }

  aggregationOperator(short) {
    return this.aggregation_operators_lookup[short];
  }

  // @deprecated: use aggregationOperators
  get aggregation_operators() {
    return this.aggregationOperators();
  }

  // @deprecated: use aggregationOperatorsLookup
  get aggregation_operators_lookup() {
    return this.aggregationOperatorsLookup();
  }

  // FIELDS

  @memoize
  fieldsLookup() {
    return createLookupByProperty(this.fields, "id");
  }

  // @deprecated: use fieldsLookup
  get fields_lookup() {
    return this.fieldsLookup();
  }

  /**
   * @param {string} description
   * @param {Database} db
   * @param {?Schema} schema
   * @param {Field[]} fields
   * @param {import("./TableTypes").EntityType} entity_type
   * @param {import("./TableTypes").SchemaName} schema_name
   */
  constructor(description, db, schema, fields, entity_type, schema_name) {
    this.description = description;
    this.db = db;
    this.schema = schema;
    this.fields = fields;
    this.entity_type = entity_type;
    this.schema_name = schema_name;
  }
}

const table = new Table();
table.entity_type = "bla";
