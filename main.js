import vehicleQueueApi from "./api/vehicleQueueApi";

const VEHICLE_TYPE = ["bike", "truck", "cooler"];

const extractData = (data, type) => {
    return data.filter(x => x.vehicleType.toUpperCase() === type.toUpperCase());
}

const addMoreLine = (data, type) => {
    const itemTemplate = {
        "driver_name": "",
        "vehicle_type": type,
        "driver_contact_phone": "",
        "license_plate": "",
        "shipping_type": "",
        "product_type": "",
        "supplier": "",
        "queue_number": "",
    }

    const dataLength = data.length;

    if (dataLength >= 10) {
        return data;
    }

    for (let i = 0; i < 10 - dataLength; i++) {
        data.push(itemTemplate);
    }
}

const initExtractSupplierCode = (data) => {
    data.map((x) => {
        x.supplier = x.supplier.split("\n").map(x => x.split("-")[0]).join(", ").toUpperCase();
    })
}

const initLoadData = (data, type) => {
    const newData = extractData(data, type)[0].importRegistration.sort(function (a, b) { return a.queue_number - b.queue_number });

    initExtractSupplierCode(newData);
    addMoreLine(newData, type);

    const rootEle = document.querySelector(`.${type}`);
    if (rootEle) {
        const tBody = rootEle.getElementsByTagName("tbody")[0];
        if (tBody) {
            let trEle = newData.map((x, index) => {
                while (index <= 9) {
                    return `
                        <tr class="bg-white border-b h-14">
                        <th scope="row" class="whitespace-nowrap">${x.queue_number}</th>
                        <td class="">${x.license_plate}</td>
                        <td class="">${x.supplier}</td>
                    </tr>
                    `
                }
            }).join("");
            tBody.innerHTML = trEle;
        }
    }
}

(() => {
    async function fetchDataAndReload() {

        try {

            const { data } = await vehicleQueueApi.getAll();

            initLoadData(data, VEHICLE_TYPE[0]);
            initLoadData(data, VEHICLE_TYPE[1]);
            initLoadData(data, VEHICLE_TYPE[2]);
            // console.log("run")

        } catch (error) {
            console.log("Failed to fetch data from server", error);
        }

        setTimeout(fetchDataAndReload, 2000);
    }

    fetchDataAndReload();
})();
