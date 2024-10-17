import vehicleInfo from "../../api/vehicleInfo";

(() => {
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

            alert("Không tìm thấy thông tin! Hoặc nhập sai cú pháp!\nNhập lại theo ví dụ: 54Y1-12345")
        }
    })
})();