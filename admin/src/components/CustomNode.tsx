/**
 *
 * PluginIcon
 *
 */

import React, { useMemo } from "react";
import {
  Badge,
  Box,
  Divider,
  Tooltip,
  Typography,
} from "@strapi/design-system";
import { useTheme } from "styled-components";
import { Handle, NodeProps, Position } from "reactflow";
import { RelationIcon } from "./RelationIcon";
import { getIcon } from "../utils/themeUtils";
import "./CustomNode.css";

interface Attribute {
  type: string;
  relation?: string;
  [key: string]: any;
}

interface CustomNodeData {
  key: string;
  info: {
    displayName: string;
    [key: string]: any;
  };
  attributes: {
    [key: string]: Attribute;
  };
  options: {
    showRelationsOnly: boolean;
    showDefaultFields: boolean;
    showTypes: boolean;
    showIcons: boolean;
    [key: string]: any;
  };
  [key: string]: any;
}

// Extended NodeProps to include our custom data
interface CustomNodeProps extends NodeProps {
  data: CustomNodeData;
}

// Custom comparison function to prevent unnecessary re-renders
const areEqual = (prevProps: CustomNodeProps, nextProps: CustomNodeProps): boolean => {
  // Only re-render if options or attributes have changed
  return (
    prevProps.data.options === nextProps.data.options &&
    prevProps.data.attributes === nextProps.data.attributes
  );
};

// Memoized function to filter attributes based on options
const filterAttributes = (
  attributes: { [key: string]: Attribute },
  options: { showRelationsOnly: boolean; showDefaultFields: boolean }
): [string, Attribute][] => {
  let result = Object.entries(attributes);

  if (options.showRelationsOnly) {
    result = result.filter((x) => x[1].type === "relation");
  }

  if (!options.showDefaultFields) {
    const defaultFields = ["updatedAt", "createdAt", "updatedBy", "createdBy", "publishedAt"];
    result = result.filter(
      (x) => !defaultFields.includes(x[0])
    );
  }

  return result;
};

const CustomNode = React.memo<CustomNodeProps>(({ data }) => {
  const theme = useTheme();

  // Memoize the filtered attributes to avoid recalculation on every render
  const attributesToShow = useMemo(() =>
    filterAttributes(data.attributes, data.options),
    [data.attributes, data.options.showRelationsOnly, data.options.showDefaultFields]
  );

  // Memoize the handle style to avoid recreation on each render
  const handleStyle = useMemo(() => ({
    borderColor: theme.colors?.neutral200,
    background: theme.colors?.neutral0,
  }), [theme.colors]);

  // Memoize the divider style to avoid recreation on each render
  const dividerStyle = useMemo(() => ({ margin: "8px 0" }), []);

  return (
    <>
    {/* TODO remove styling when this issue is fixed: https://github.com/strapi/design-system/issues/1853 */}
			<style>
				{`
					.cte-plugin-box {
            position: relative;
            min-width: 280px;
            padding: 16px;
          }

          .cte-plugin-header {
            user-select: text;
            cursor: auto;
          }

          .cte-plugin-line {
            margin-right: auto;
            padding-right: 12px; /*minimum gap*/
            margin-top: -2px;
            user-select: text;
            cursor: auto;
          }

          .cte-plugin-handle {
            position: absolute;
            right: -27px;
            top: 6px;
            bottom: 0;
            margin: auto;
            visibility: hidden;
            position: absolute;
            padding: 0;
          }

          .cte-plugin-field {
            display: flex;
            align-items: center;
            margin-bottom: 6px;
            position: relative;
          }
				`}
			</style>
      <Box
      background="neutral0"
      shadow="tableShadow"
      hasRadius
      padding="16px 24px"
      className="cte-plugin-box"
    >
      <Typography
        fontWeight="bold"
        textColor="buttonPrimary500"
        padding="16px"
        className="cte-plugin-header nodrag"
      >
        {data.info.displayName}
      </Typography>

      <br />
      <Typography
        textColor="neutral400"
        padding="16px"
        className="cte-plugin-header nodrag"
      >
        {data.key}
        <Handle
          type="target"
          position={Position.Top}
          style={handleStyle}
        />
      </Typography>

      <Divider style={dividerStyle} />

      {attributesToShow.map((attr) => {
        return (
          <Typography key={attr[0]}>
            <div className="cte-plugin-field">
              <p className="cte-plugin-line nodrag">{attr[0]}</p>
              <div style={{ display: "flex", alignItems: "center" }}>
                {data.options.showTypes && (
                  <Badge
                    size="M"
                    backgroundColor="neutral0"
                    textColor="neutral400"
                  >
                    {attr[1].type}
                  </Badge>
                )}

                {data.options.showIcons && getIcon(attr[1].type)}
                {attr[1].type === "relation" && (
                  <>
                    <Tooltip description={attr[1].relation}>
                      <RelationIcon theme={theme as { colors: { [key: string]: string; neutral0: string; buttonPrimary500: string; } }}>
                        {getIcon(attr[1].relation ?? '')}
                      </RelationIcon>
                    </Tooltip>
                    <Handle
                      type="source"
                      id={attr[0]}
                      position={Position.Right}
                      className="cte-plugin-handle"
                    />
                  </>
                )}
              </div>
            </div>
          </Typography>
        );
      })}
    </Box>
    </>
  );
}, areEqual);

// Add display name for better debugging
CustomNode.displayName = 'CustomNode';

export { CustomNode };
