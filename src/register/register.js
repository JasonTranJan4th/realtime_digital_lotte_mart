import * as yup from 'yup';
import registerApi from '../../api/registerApi';


function getPostSchema() {
    const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    return yup.object().shape({
        driver_name: yup.string().required('Vui lòng nhập họ & tên'),
        driver_contact_phone: yup.string().required('Vui lòng nhập số điện thoại').matches(phoneRegExp, 'Số điện thoại không hợp lệ'),
        license_plate: yup.string().required('Vui lòng nhập biển số xe').matches(/^\d{2}[a-zA-Z]([a-zA-Z]|\d)?-\d{4,5}$/, 'Biển số sai cú pháp VD: 54Y1-12345 hoặc 53C-12345'),
        supplier: yup.string().required('Vui lòng điền thông tin NCC'),
    });
}

function setFieldError(form, name, error) {
    const element = form.querySelector(`[name="${name}"]`);
    if (element) {
        element.setCustomValidity(error);

        const errorMessageEle = element.parentElement.querySelector('.invalid-feedback');

        if (!errorMessageEle) return;

        errorMessageEle.textContent = error;
    }
}

async function validatePostForm(form, formValues) {
    try {

        //reset previous errors
        ['driver_name', 'driver_contact_phone', 'license_plate', 'supplier'].forEach((name) => setFieldError(form, name, ''));

        const schema = getPostSchema();
        await schema.validate(formValues, { abortEarly: false });

        try {

            const { data } = await registerApi.register(JSON.stringify(formValues));

            if (data) {
                const success_modal = document.querySelector(".success_modal");
                if (success_modal) {
                    const success_modal_noti = success_modal.querySelector(".success_modal_noti");
                    if (success_modal_noti) {
                        success_modal_noti.textContent = `${formValues.license_plate} đăng ký thành công!`;
                    }
                    success_modal.classList.remove("hidden");

                    const modal_btn = document.getElementById("success_model_btn");
                    if (modal_btn) {
                        modal_btn.addEventListener("click", () => {
                            success_modal.classList.add("hidden");
                            form.reset();
                        })
                    }
                }
            }
        } catch (error) {
            alert("Đăng ký không thành công!")
        }

    } catch (error) {
        // console.log("1", error.name);
        // console.log("2", error.inner);

        //vì có những field check 2 điều kiện nhưng khi có lỗi sẽ hiển thị lỗi của điều kiện 2 do dk 1 bị ghi đè nên sử dụng object này để handle
        const errorLog = {}

        if (error.name === "ValidationError" && Array.isArray(error.inner)) {
            for (const validationError of error.inner) {

                const name = validationError.path;

                if (errorLog[name]) continue;

                setFieldError(form, name, validationError.message);
                errorLog[name] = true;
            }
        }
    }

    const isValid = form.checkValidity();
    if (!isValid) form.classList.add('was-validated');
}

export function setFieldValue(form, selector, value) {
    if (!form) return;

    const field = form.querySelector(selector);
    if (field) field.value = value;
}

async function validateFormField(form, formValues, name) {
    try {
        setFieldError(form, name, '');

        const schema = getPostSchema();
        await schema.validateAt(name, formValues);

    } catch (error) {
        setFieldError(form, name, error.message);
    }
    const field = form.querySelector(`[name="${name}"]`);

    if (field && !field.checkValidity()) {
        field.parentElement.classList.add("was-validated");
    }
}

function initValidationOnChange(form) {
    ['driver_name', 'driver_contact_phone', 'license_plate', 'supplier'].forEach((name) => {
        const field = form.querySelector(`[name=${name}]`);
        if (field) {
            field.addEventListener('input', (e) => {
                const newValues = e.target.value;
                validateFormField(form, { [name]: newValues }, name);
            })
        }
    })
}

(() => {
    const registerForm = document.getElementById("registerForm");

    if (!registerForm) return;

    initValidationOnChange(registerForm);

    registerForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(registerForm);
        const formValues = Object.fromEntries(formData.entries());

        formValues.license_plate = formValues.license_plate.toUpperCase();
        // console.log(JSON.stringify(formValues));

        await validatePostForm(registerForm, formValues);
    })
})();