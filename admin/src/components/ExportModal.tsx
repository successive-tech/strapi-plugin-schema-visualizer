import React, { useCallback, useState, RefObject } from "react";
import {
  Modal,
  Button,
  Typography,
  SingleSelect,
  SingleSelectOption,
  NumberInput,
  Field,
  Loader,
} from "@strapi/design-system";
import { toJpeg, toPng, toSvg } from "html-to-image";
import { useDigramStore } from "../store";
import { useTheme } from "styled-components";

interface ExportModalProps {
  imageRef: RefObject<HTMLDivElement>;
}

export function ExportModal({ imageRef }: ExportModalProps): React.ReactElement {
  const theme = useTheme();

  const { setShowModal } = useDigramStore();

  const [format, setFormat] = useState<string>("png");
  const [quality, setQuality] = useState<number>(0.95);
  const [isExporting, setIsExporting] = useState<boolean>(false);

  function downloadImage(dataUrl: string, fileExtension: string): void {
    const link = document.createElement("a");
    link.download = `strapi-schema-diagram-${new Date()
      .toISOString()
      .replace(/[-:T.]/g, "")
      .slice(0, -5)}.${fileExtension}`;
    link.href = dataUrl;
    link.click();
    setIsExporting(false);
  }

  const exportDiagram = useCallback(() => {
    if (imageRef.current === null) {
      return;
    }

    // Set loading state immediately when button is clicked
    setIsExporting(true);

    // Small timeout to ensure the UI updates with the loader before heavy processing begins
    setTimeout(() => {
      const filter = (node: HTMLElement): boolean => {
        const exclusionClasses = ["cte-plugin-controls"];
        return !exclusionClasses.some((classname) =>
          node.classList?.contains(classname)
        );
      };

      if (format == "png") {
        toPng(imageRef.current, {
          cacheBust: true,
          filter: filter,
          style: {
            background: theme.colors?.neutral100,
          },
        })
          .then((dataUrl) => {
            downloadImage(dataUrl, "png");
          })
          .catch((err) => {
            console.log(err);
            setIsExporting(false);
          });
      } else if (format == "svg") {
        toSvg(imageRef.current, {
          cacheBust: true,
          filter: filter,
          style: {
            background: theme.colors?.neutral100,
          },
        })
          .then((dataUrl) => {
            downloadImage(dataUrl, "svg");
          })
          .catch((err) => {
            console.log(err);
            setIsExporting(false);
          });
      } else if (format == "jpeg") {
        toJpeg(imageRef.current, {
          cacheBust: true,
          filter: filter,
          quality: quality,
          style: {
            background: theme.colors?.neutral100,
          },
        })
          .then((dataUrl) => {
            downloadImage(dataUrl, "jpeg");
          })
          .catch((err) => {
            console.log(err);
            setIsExporting(false);
          });
      }
    }, 0);
  }, [imageRef, quality, format, theme]);

  return (
    <Modal.Content>
      <Modal.Header>
        <Modal.Title>
          Export Diagram
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Field.Label>Format</Field.Label>
          <SingleSelect
            onClear={() => {
              setFormat("");
            }}
            value={format}
            onChange={(value) => setFormat(value as string)}
          >
            <SingleSelectOption value="svg">SVG</SingleSelectOption>
            <SingleSelectOption value="png">PNG</SingleSelectOption>
            <SingleSelectOption value="jpeg">JPEG</SingleSelectOption>
          </SingleSelect>
        <span style={{ height: "16px", display: "block" }} />
        {format == "jpeg" && (
          <div>
            <Field.Label>Quality</Field.Label>
            <Typography variant="pi" textColor="neutral600">0.0 - 1.0</Typography>
              <NumberInput
                name="quality"
                onValueChange={(value) => {
                  if (value !== undefined) {
                    setQuality(value);
                  }
                }}
                value={quality}
              />
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button
          onClick={exportDiagram}
          disabled={isExporting}
          startIcon={isExporting ? <Loader small /> : undefined}
        >
          {isExporting ? "Exporting..." : "Export"}
        </Button>
      </Modal.Footer>
    </Modal.Content>
  );
}
