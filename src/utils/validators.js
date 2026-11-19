const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^(\+90|0)?5\d{9}$/ // 05XX XXX XX XX, +90 5XX... ya da 5XX...
const NAME_RE = /^[\p{L}\s'.-]+$/u

export const initialCheckoutValues = {
  fullName: '',
  email: '',
  phone: '',
  city: '',
  postalCode: '',
  address: '',
}

// Boşluk, tire ve parantezleri temizleyip sadece rakam ve + bırakır
function normalizePhone(value) {
  return value.replace(/[\s\-()]/g, '')
}

// Her alan için hata mesajı döndürür; hata yoksa alan sonuçta yer almaz
export function validateCheckout(values) {
  const errors = {}

  const fullName = values.fullName.trim()
  if (!fullName) {
    errors.fullName = 'Ad soyad boş bırakılamaz.'
  } else if (!NAME_RE.test(fullName)) {
    errors.fullName = 'Ad soyad yalnızca harf içermelidir.'
  } else if (fullName.split(/\s+/).length < 2) {
    errors.fullName = 'Lütfen ad ve soyadını birlikte gir.'
  }

  const email = values.email.trim()
  if (!email) {
    errors.email = 'E-posta boş bırakılamaz.'
  } else if (!EMAIL_RE.test(email)) {
    errors.email = 'Geçerli bir e-posta adresi gir (örn. ad@site.com).'
  }

  const phone = normalizePhone(values.phone)
  if (!phone) {
    errors.phone = 'Telefon numarası boş bırakılamaz.'
  } else if (!PHONE_RE.test(phone)) {
    errors.phone = 'Geçerli bir cep telefonu gir (örn. 05XX XXX XX XX).'
  }

  if (!values.city.trim()) {
    errors.city = 'Şehir boş bırakılamaz.'
  }

  const postalCode = values.postalCode.trim()
  if (!postalCode) {
    errors.postalCode = 'Posta kodu boş bırakılamaz.'
  } else if (!/^\d{5}$/.test(postalCode)) {
    errors.postalCode = 'Posta kodu 5 haneli olmalıdır.'
  }

  const address = values.address.trim()
  if (!address) {
    errors.address = 'Adres boş bırakılamaz.'
  } else if (address.length < 10) {
    errors.address = 'Adres en az 10 karakter olmalıdır.'
  }

  return errors
}

// --- Yeni Eklenen Login ve Register Validasyonları ---

export const initialLoginValues = { email: '', password: '' }

export const initialRegisterValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
}

export function validateLogin(values) {
  const errors = {}

  const email = values.email.trim()
  if (!email) errors.email = 'E-posta boş bırakılamaz.'
  else if (!EMAIL_RE.test(email)) errors.email = 'Geçerli bir e-posta adresi gir.'

  if (!values.password) errors.password = 'Şifre boş bırakılamaz.'

  return errors
}

export function validateRegister(values) {
  const errors = validateLogin(values)

  const name = values.name.trim()
  if (!name) errors.name = 'Ad soyad boş bırakılamaz.'
  else if (!NAME_RE.test(name)) errors.name = 'Ad soyad yalnızca harf içermelidir.'

  if (!errors.password && values.password.length < 6) {
    errors.password = 'Şifre en az 6 karakter olmalıdır.'
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = 'Şifre tekrarı boş bırakılamaz.'
  } else if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Şifreler eşleşmiyor.'
  }

  return errors
}