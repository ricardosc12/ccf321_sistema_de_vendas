export function getInputs(inputs){
    const ipt = {}

    inputs.forEach(id => {
        ipt[id] = document.getElementById(id)?.value
    });

    return ipt
}