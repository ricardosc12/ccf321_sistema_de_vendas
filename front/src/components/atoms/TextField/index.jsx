import { TextField as TF } from "@kobalte/core";
import "./style.css";

export function TextField({ type, label, id, ...props }) {
    return (
        <TF.Root class="text-field" name={id}>
            <TF.Label class="text-field__label">{label}</TF.Label>
            <TF.Input type={type} id={id} class="text-field__input" {...props}/>
        </TF.Root>
    );
}