import vehicleInfo from "../../api/vehicleInfo";

let timeOutId = undefined;
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
        if (!input.value) return;

        try {

            const { data } = await vehicleInfo.getInfo(input.value);

            if (data) {

                async function fetchDataAndReload() {
                    try {
                        const { data } = await vehicleInfo.getInfo(input.value);
                        console.log(data);
                        const infoEle = document.querySelector(".info");

                        if (infoEle) {
                            const vehicleNumberEle = infoEle.querySelector(".vehicel_number");
                            const vehicleQueueEle = infoEle.querySelector(".vehicle_queue");
                            const supplier = infoEle.querySelector(".supplier");
                            const status = infoEle.querySelector(".status");
                            status.classList.remove("status_success", "status_normal", "status_danger");

                            if (vehicleNumberEle && vehicleQueueEle && supplier && status) {
                                vehicleNumberEle.textContent = data.license_plate;
                                vehicleQueueEle.textContent = data.queue_number;
                                supplier.textContent = data.supplier;

                                switch (data.status) {
                                    case 0:
                                        status.textContent = "Chờ xuống hàng";
                                        status.classList.add("status_normal");
                                        break;
                                    case 1:
                                        status.textContent = "Xuống hàng";
                                        status.classList.add("status_success");
                                        break;
                                    case 2:
                                        status.textContent = "Đã xuống hàng";
                                        status.classList.add("status_danger");
                                        break;

                                    default:
                                        break;
                                }
                            }
                        }
                    } catch (error) {
                        console.log("failed to refresh data");
                    }

                    timeOutId = setTimeout(fetchDataAndReload, 2000);
                }

                fetchDataAndReload();
            }

        } catch (error) {

            const infoEle = document.querySelector(".info");
            if (infoEle) {
                const vehicleNumberEle = infoEle.querySelector(".vehicel_number");
                const vehicleQueueEle = infoEle.querySelector(".vehicle_queue");
                const supplier = infoEle.querySelector(".supplier");
                const status = infoEle.querySelector(".status");

                if (vehicleNumberEle && vehicleQueueEle && supplier && status) {
                    vehicleNumberEle.textContent = "----";
                    vehicleQueueEle.textContent = "--";
                    supplier.textContent = "----";
                    status.textContent = "N/A";
                    status.classList.remove("status_success", "status_normal", "status_danger");
                }
            }

            clearTimeout(timeOutId);

            alert("BIỂN SỐ XE KHÔNG ĐÚNG HOẶC CHƯA ĐƯỢC CẤP SỐ.")
        }
    })
})();