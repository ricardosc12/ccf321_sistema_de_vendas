import {
    Select as SelectHope, SelectTrigger, SelectPlaceholder,
    SelectValue, SelectIcon, SelectContent, SelectListbox,
    SelectOption, SelectOptionText, SelectOptionIndicator, FormControl, FormLabel
} from "@hope-ui/solid";
import { For, createEffect, createSignal } from "solid-js";


export function Select(props) {
    
    const [value, setValue] = createSignal(props.defaultValue || "")

    createEffect(()=>{
        setValue(props.defaultValue)
    })

    const onChange=(e)=>{
        setValue(e)
        props.onChange&&props.onChange(e)
    }

    return (
        <FormControl>
            <input class="hidden" type="text" id={props.id} value={value()}/>
            {!props.disabledLabel?<FormLabel style="color:rgb(248 250 252);" for={props.id}>{props.label} {props.required?" *":""}</FormLabel>:""}
            <SelectHope {...props} onChange={onChange}> 
                <SelectTrigger style="background:rgb(248 250 252);color:black;">
                    <SelectPlaceholder style="color:rgba(90,90,90);">{props.label}</SelectPlaceholder>
                    <SelectValue />
                    <SelectIcon />
                </SelectTrigger>
                <SelectContent>
                    <SelectListbox>
                        <For each={props.data}>
                            {item => (
                                <SelectOption value={item.value}>
                                    <SelectOptionText>{item.label}</SelectOptionText>
                                    <SelectOptionIndicator />
                                </SelectOption>
                            )}
                        </For>
                    </SelectListbox>
                </SelectContent>
            </SelectHope>
        </FormControl>
    );
}