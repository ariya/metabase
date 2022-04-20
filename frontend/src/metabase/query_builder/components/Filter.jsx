/* eslint-disable react/prop-types */
import React from "react";

import { t } from "ttag";

import { color } from "metabase/lib/colors";

import ViewPill from "metabase/query_builder/components/view/ViewPill";

const DEFAULT_FILTER_RENDERER = ({ field, operator, values }) => {
  const items = [field, operator, ...values];
  // insert an "and" at the end if multiple values
  // NOTE: works for "between", not sure about others
  if (values.length > 1) {
    items.splice(items.length - 1, 0, "and");
  }
  return (
    <span>
      {items
        .filter(f => f)
        .map((item, index, array) => (
          <span key={index}>
            {item}
            {index < array.length - 1 ? " " : null}
          </span>
        ))}
    </span>
  );
};

const FilterPill = props => <ViewPill color={color("filter")} {...props} />;

export const OperatorFilter = ({ index, filter, removeFilter }) => {
  return (
    <FilterPill onRemove={() => removeFilter(index)}>
      {filter.displayName()}
    </FilterPill>
  );
};

export const SegmentFilter = ({
  filter,
  metadata,
  children = DEFAULT_FILTER_RENDERER,
}) => {
  const segment = metadata.segment(filter[1]);
  return children({
    operator: t`Matches`,
    values: segment ? [segment.name] : [],
  });
};

const Filter = ({ filter, ...props }) =>
  filter[0] === "segment" ? (
    <SegmentFilter filter={filter} {...props} />
  ) : (
    <OperatorFilter filter={filter} {...props} />
  );

export default Filter;
