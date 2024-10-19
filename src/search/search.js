import vehicleInfo from "../../api/vehicleInfo";

(() => {

    const navList = document.querySelectorAll("ol li");
    for (let i = 0; i < navList.length; i++) {
        const navEle = navList[i];

        navEle.addEventListener('click', () => {
            const eleAttr = navEle.getAttribute("id");
            switch (eleAttr) {
                case "nav-main":
                    window.location.assign("/");
                    break;
                case "nav-register":
                    window.location.assign("/src/register/");
                    break;
                case "nav-search":
                    window.location.assign("/src/search/");
                    break;
                default:
                    break;
            }
        })
    }

    const btn = document.querySelector(".searh_btn");
    const input = document.querySelector(".vehicle_input");
    btn.addEventListener("click", async () => {
        // console.log(input.value);

        try {

            const { data } = await vehicleInfo.getInfo(input.value);

            if (data) {
                const infoEle = document.querySelector(".info");
                if (infoEle) {
                    const vehicleNumberEle = infoEle.querySelector(".vehicel_number");
                    const vehicleQueueEle = infoEle.querySelector(".vehicle_queue");

                    if (vehicleNumberEle && vehicleQueueEle) {
                        vehicleNumberEle.textContent = data.license_plate;
                        vehicleQueueEle.textContent = data.queue_number;
                    }
                }
            }

        } catch (error) {

            const infoEle = document.querySelector(".info");
            if (infoEle) {
                const vehicleNumberEle = infoEle.querySelector(".vehicel_number");
                const vehicleQueueEle = infoEle.querySelector(".vehicle_queue");

                if (vehicleNumberEle && vehicleQueueEle) {
                    vehicleNumberEle.textContent = "----";
                    vehicleQueueEle.textContent = "--";
                }
            }

            alert("Chưa được cấp số! Hoặc nhập sai cú pháp!\nNhập lại biển số xe theo ví dụ: 54Y1-12345")
        }
    })
})();