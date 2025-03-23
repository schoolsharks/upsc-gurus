import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React from "react";


export const downloadAnalyticsPdf = async (pageRef:React.RefObject<HTMLDivElement | null>,testId:string) => {

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageUrl = window.location.href;

    const buttonWidth = 60;
    const buttonHeight = 12;
    const buttonX = pdf.internal.pageSize.getWidth() - buttonWidth - 10;
    const buttonY = 10;

    pdf.setFillColor(14, 32, 84);
    pdf.rect(buttonX, buttonY, buttonWidth, buttonHeight, "F");

    pdf.setTextColor(255, 255, 255);
    pdf.setFont("sans-serif", "bold");
    pdf.setFontSize(8);

    const text = "View Full Analysis";
    const textX =
      buttonX +
      (buttonWidth -
        45 -
        pdf.getStringUnitWidth(text) * pdf.internal.scaleFactor * (8 / 72)) /
        2;
    const textY = buttonY + 8.5;
    pdf.text(text, textX, textY);

    pdf.link(buttonX, buttonY, buttonWidth, buttonHeight, {
      url: pageUrl,
    });

    if (pageRef.current) {
      const canvas = await html2canvas(pageRef.current, {
        scale: 1,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth() - 40;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(
        imgData,
        "PNG",
        20,
        buttonY + buttonHeight + 10,
        pdfWidth,
        pdfHeight
      );
    }

      pdf.save(`test-analysis-${testId}.pdf`);
    
  };
