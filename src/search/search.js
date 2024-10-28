import vehicleInfo from "../../api/vehicleInfo";

let timeOutId = undefined;

const reFormatString = (stringValue) => {
    const customItems = stringValue.split("\n");

    for (let i = 0; i < customItems.length; i++) {
        customItems[i] = customItems[i] + "<br>";
    }

    return customItems.join("");
}

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
                        input.addEventListener('input', function () {
                            clearTimeout(timeOutId);
                        })

                        const { data } = await vehicleInfo.getInfo(input.value);
                        // console.log(data);
                        const infoEle = document.querySelector(".info");

                        if (infoEle) {
                            const vehicleNumberEle = infoEle.querySelector(".vehicel_number");
                            const vehicleQueueEle = infoEle.querySelector(".vehicle_queue");
                            const supplier = infoEle.querySelector(".supplier");
                            const status = infoEle.querySelector(".status");
                            status.classList.remove("status_success", "status_normal", "status_danger", "status_pendding", "status_finished");

                            if (vehicleNumberEle && vehicleQueueEle && supplier && status) {
                                vehicleNumberEle.textContent = data.license_plate;
                                supplier.textContent = reFormatString(data.supplier);

                                supplier.classList.remove("line-clamp-2");

                                if (reFormatString(data.supplier).includes("<br>")) {
                                    supplier.innerHTML = reFormatString(data.supplier);
                                } else {
                                    supplier.textContent = reFormatString(data.supplier);
                                    supplier.classList.add("line-clamp-2");
                                }

                                switch (data.status) {
                                    case -1:
                                        vehicleQueueEle.textContent = "0";
                                        status.textContent = "Đăng ký bị hủy";
                                        status.classList.add("status_danger");
                                        return;
                                    case 0:
                                        vehicleQueueEle.textContent = "0";
                                        status.textContent = "Chưa cấp số";
                                        status.classList.add("status_pendding");
                                        break;
                                    case 1:
                                        vehicleQueueEle.textContent = data.vehicle_type === "bike" ? `${data.queue_number}M` : data.vehicle_type === "truck" ? `${data.queue_number}T` : `${data.queue_number}L`;
                                        status.textContent = "Chờ xuống hàng";
                                        status.classList.add("status_normal");
                                        break;
                                    case 2:
                                        vehicleQueueEle.textContent = data.vehicle_type === "bike" ? `${data.queue_number}M` : data.vehicle_type === "truck" ? `${data.queue_number}T` : `${data.queue_number}L`;
                                        status.textContent = "Xuống hàng";
                                        status.classList.add("status_success");
                                        break;
                                    case 3:
                                        vehicleQueueEle.textContent = data.vehicle_type === "bike" ? `${data.queue_number}M` : data.vehicle_type === "truck" ? `${data.queue_number}T` : `${data.queue_number}L`;
                                        status.textContent = "Đã xuống hàng";
                                        status.classList.add("status_finished");
                                        return;

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
                    status.classList.remove("status_success", "status_normal", "status_danger", "status_pendding", "status_finished");
                }
            }

            clearTimeout(timeOutId);

            alert("BIỂN SỐ XE KHÔNG ĐÚNG HOẶC CHƯA ĐĂNG KÝ.")
        }
    })
})();