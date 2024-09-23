import { useState, useEffect } from "react";
import { StyledControl } from "../sections/ControlSection";
import { MultiSelect } from "primereact/multiselect";
import { ControlTitle } from "./ControlTitle";

export function MultiSelectControl({ title, options, placeHolder = "Select...", columnSpan = 1, rowSpan = 1, defaultValues = null }: {
    title: string,
    options: { label: string, value: string }[],
    placeHolder?: string,
    columnSpan?: number,
    rowSpan?: number,
    defaultValues?: string[] | null
}) {
    const [selectedOptions, setSelectedOptions] = useState<string[]>(defaultValues || []);

    const width = 150 * columnSpan;

    useEffect(() => {
        if (defaultValues) {
            setSelectedOptions(defaultValues);
        }
    }, [defaultValues]);

    return (
        <StyledControl $columnSpan={columnSpan} $rowSpan={rowSpan}>
            <ControlTitle title={title} margin={'0'} />
            <MultiSelect id={"multiSelect"}
                         value={selectedOptions}
                         options={options}
                         placeholder={placeHolder}
                         style={{ width: width + "px" }}
                         onChange={(e) => setSelectedOptions(e.value)} />
        </StyledControl>
    );
}