import * as yup from 'yup';


function getPostSchema() {
    const phoneRegExp = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
    return yup.object().shape({
        drivername: yup.string().required('Vui lòng nhập họ & tên').min(3, 'Username must be at least 3 characters'),
        tel: yup.string().required('Vui lòng nhập số điện thoại').matches(phoneRegExp, 'Phone number is not valid'),
        vehiclenumber: yup.string().required('Vui lòng nhập biển số xe'),
        suppilername: yup.string().required('Vui lòng điền thông tin NCC'),
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
        ['drivername', 'tel', 'vehiclenumber', 'suppilername'].forEach((name) => setFieldError(form, name, ''));

        const schema = getPostSchema();
        await schema.validate(formValues, { abortEarly: false });

        console.log('Form submitted successfully:', formValues);
        form.reset();

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
    ['drivername', 'tel', 'vehiclenumber', 'suppilername'].forEach((name) => {
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

        await validatePostForm(registerForm, formValues);
    })
})();