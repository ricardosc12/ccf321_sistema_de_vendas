import { Select as SE } from "@kobalte/core";
import "./style.css";

export function Select({ label, data, id, ...props }) {
    return (
        <SE.Root
            name={id}
            options={data}
            optionValue="value"
            optionTextValue="label"      
            placeholder={label}
            itemComponent={props => (
                <SE.Item item={props.item} class="select__item">
                    <SE.ItemLabel>{props.item.rawValue.label}</SE.ItemLabel>
                </SE.Item>
            )}
        >
            <SE.Trigger class="select__trigger" aria-label={label}>
                <SE.Value class="select__value">
                    {state => state.selectedOption().label}
                </SE.Value>
            </SE.Trigger>
            <SE.Portal>
                <SE.Content class="select__content">
                    <SE.Listbox class="select__listbox" />
                </SE.Content>
            </SE.Portal>
        </SE.Root>
    );
}