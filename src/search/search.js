(() => {
    const btn = document.querySelector(".searh_btn");
    const input = document.querySelector(".vehicle_input");
    btn.addEventListener("click", () => {
        console.log(input.value);
    })
})();