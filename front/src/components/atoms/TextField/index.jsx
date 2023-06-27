import { FormControl, FormLabel, Input, FormHelperText, InputGroup, InputLeftAddon, InputRightAddon } from "@hope-ui/solid";

export function TextField(props) {

    const onInput = (e) => {
        if(!props.real) return

        const value = e.target.value

        if(e.key == "Backspace" || e.key == "Tab") return
        else if (e.key != "." && isNaN(parseInt(e.key))) {
            e.preventDefault()
            e.stopPropagation()
            return
        }
        else if (e.key == "." && value.includes(".")) {
            e.preventDefault()
            e.stopPropagation()
            return
        }
    }

    return (
        <FormControl>
            <FormLabel for={props.id}>{props.label}</FormLabel>
            <InputGroup>
                {props.left ? <InputLeftAddon>{props.left}</InputLeftAddon> : ""}
                <Input onkeydown={onInput} id={props.id} type={props.type} {...props} />
                {props.right ? <InputRightAddon>{props.right}</InputRightAddon> : ""}
            </InputGroup>
            {/* <FormHelperText>We'll never share your email.</FormHelperText> */}
        </FormControl>
    );
}