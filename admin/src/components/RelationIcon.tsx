import React from "react";
import "./RelationIcon.css";

interface RelationIconProps {
  theme: {
    colors: {
      neutral0: string;
      buttonPrimary500: string;
      [key: string]: string;
    };
  };
  children: React.ReactNode;
}

export function RelationIcon({ theme, children }: RelationIconProps): React.ReactElement {
  return (
    <>
    {/* TODO remove styling when this issue is fixed: https://github.com/strapi/design-system/issues/1853 */}
			<style>
				{`
					.cte-plugin-relation-icon {
            height: 20px;
            width: 20px;
            font-size: 12px;
            border-radius: 4px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            right: -26px;
            top: 0;
            bottom: 0;
            margin: auto;
          }

          .cte-plugin-relation-icon svg path {
            fill: var(--cte-plugin-relation-color);
          }
				`}
			</style>
      <span
        style={{
          background: theme.colors.neutral0,
          "--cte-plugin-relation-color": theme.colors.buttonPrimary500,
        } as React.CSSProperties}
        className="cte-plugin-relation-icon"
      >
        {children}
      </span>
    </>
  );
}
