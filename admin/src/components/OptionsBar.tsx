import React from 'react';
import {
  Checkbox,
  SingleSelect,
  SingleSelectOption,
} from "@strapi/design-system";
import { useDigramStore } from "../store";

export function OptionsBar(): React.ReactElement {
  const { options, toggleOption } = useDigramStore();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "flex-start",
        padding: "0 56px 24px",
        gap: "24px",
      }}
    >
      <Checkbox
        name="show-type-names"
        onCheckedChange={() => {
          toggleOption("showTypes");
        }}
        checked={options.showTypes}
      >
        Data Types
      </Checkbox>
      <Checkbox
        name="show-icons"
        onCheckedChange={() => toggleOption("showIcons")}
        checked={options.showIcons}
      >
        Data Type Icons
      </Checkbox>
      <Checkbox
        name="show-default-fields"
        onCheckedChange={() => toggleOption("showDefaultFields")}
        checked={options.showDefaultFields}
      >
        Default Fields
      </Checkbox>
      <Checkbox
        name="show-relations-only"
        onCheckedChange={() => toggleOption("showRelationsOnly")}
        checked={options.showRelationsOnly}
      >
        Relational Fields Only
      </Checkbox>
      <Checkbox
        name="show-admin-types"
        onCheckedChange={() => toggleOption("showAdminTypes")}
        checked={options.showAdminTypes}
      >
        admin:: Types
      </Checkbox>
      <Checkbox
        name="show-plugin-types"
        onCheckedChange={() => toggleOption("showPluginTypes")}
        checked={options.showPluginTypes}
      >
        plugin:: Types
      </Checkbox>
      <Checkbox
        name="show-edges"
        onCheckedChange={() => toggleOption("showEdges")}
        checked={options.showEdges}
      >
        Edges
      </Checkbox>
      <Checkbox
        name="snap-to-grid"
        onCheckedChange={() => toggleOption("snapToGrid")}
        checked={options.snapToGrid}
      >
        Snap To Grid
      </Checkbox>
      <div style={{ flexGrow: 1 }} />
      <SingleSelect
        // label="Edge Type"
        value={options.edgeType}
        onChange={(type) => toggleOption("edgeType", type)}
      >
        <SingleSelectOption value="smartbezier">
          Smart Bezier
        </SingleSelectOption>
        <SingleSelectOption value="smartstraight">
          Smart Straight
        </SingleSelectOption>
        <SingleSelectOption value="smartstep">Smart Step</SingleSelectOption>
        <SingleSelectOption value="default">Bezier</SingleSelectOption>
        <SingleSelectOption value="simplebezier">
          Simple Bezier
        </SingleSelectOption>
        <SingleSelectOption value="straight">Straight</SingleSelectOption>
        <SingleSelectOption value="step">Step</SingleSelectOption>
        <SingleSelectOption value="smoothstep">Smooth Step</SingleSelectOption>
      </SingleSelect>
      <SingleSelect
        // label="Background"
        value={options.backgroundPattern}
        onChange={(pattern) => toggleOption("backgroundPattern", pattern)}
      >
        <SingleSelectOption value="dots">Dots</SingleSelectOption>
        <SingleSelectOption value="lines">Lines</SingleSelectOption>
        <SingleSelectOption value="cross">Cross</SingleSelectOption>
        <SingleSelectOption value="none">None</SingleSelectOption>
      </SingleSelect>
    </div>
  );
}
