export const activateUser = uid => {
    return `Благодарим вас за регистрацию на folkbook.ru.
            <br/> Для активации аккаунта перейдите по 
            <a href="https://api.folkbook.ru/user/activate?uid=${uid}">ссылке</a>`
};