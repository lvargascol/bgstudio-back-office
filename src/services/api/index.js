const API = process.env.NEXT_PUBLIC_API_URL;
const VERSION = process.env.NEXT_PUBLIC_API_VERSION;

const endPoints = {
  auth: {
    login: `${API}/api/${VERSION}/auth/login`,
    profile: `${API}/api/${VERSION}/auth/profile`,
    recovery: `${API}/api/${VERSION}/auth/recovery`,
    changePassword: `${API}/api/${VERSION}/auth/change-password`,
  },
  bookings: {
    getAllBooking: `${API}/api/${VERSION}/bookings`,
    getBookingByDate: (date) => `${API}/api/${VERSION}/bookings/date/${date}`,
    getScheduleByDate: (date) => `${API}/api/${VERSION}/bookings/schedule/${date}`,
    getOneBooking: (id) => `${API}/api/${VERSION}/bookings/${id}`,
    createBooking: `${API}/api/${VERSION}/bookings`,
    updateBooking: (id) => `${API}/api/${VERSION}/bookings/${id}`,
    deleteBooking: (id) => `${API}/api/${VERSION}/bookings/${id}`,
    addServiceToBooking: `${API}/api/${VERSION}/bookings/add-service`,
    removeServiceToBooking: (id) => `${API}/api/${VERSION}/bookings/remove-service/${id}`,
    addPromoToBooking: `${API}/api/${VERSION}/bookings/add-promo`,
    removePromoToBooking: (id) => `${API}/api/${VERSION}/bookings/remove-promo/${id}`,
    getSalesByDate: (date) => `${API}/api/${VERSION}/bookings/sales/${date}`,
    getSalesByDateAndSpecialist: (date, id) => `${API}/api/${VERSION}/bookings/sales/${date}/${id}`,
    getTotalSalesOnInterval: (start, end) => `${API}/api/${VERSION}/bookings/sales/total/${start}/${end}`,
    getTotalSalesOnIntervalBySpecialist: (start, end, id) => `${API}/api/${VERSION}/bookings/sales/total/${start}/${end}/${id}`,
  },
  categories: {
    getAllCategory: `${API}/api/${VERSION}/categories`,
    getOneCategory: (id) => `${API}/api/${VERSION}/categories/${id}`,
    createCategory: `${API}/api/${VERSION}/categories`,
    updateCategory: (id) => `${API}/api/${VERSION}/categories/${id}`,
    deleteCategory: (id) => `${API}/api/${VERSION}/categories/${id}`,
  },
  customers: {
    getAllCustomer: `${API}/api/${VERSION}/customers`,
    getOneCustomer: (id) => `${API}/api/${VERSION}/customers/${id}`,
    createCustomer: `${API}/api/${VERSION}/customers`,
    updateCustomer: (id) => `${API}/api/${VERSION}/customers/${id}`,
    deleteCustomer: (id) => `${API}/api/${VERSION}/customers/${id}`,
  },
  services: {
    getAllService: `${API}/api/${VERSION}/services`,
    getOneService: (id) => `${API}/api/${VERSION}/services/${id}`,
    createService: `${API}/api/${VERSION}/services`,
    updateService: (id) => `${API}/api/${VERSION}/services/${id}`,
    deleteService: (id) => `${API}/api/${VERSION}/services/${id}`,
  },
  specialists: {
    getAllSpecialist: `${API}/api/${VERSION}/specialists`,
    getOneSpecialist: (id) => `${API}/api/${VERSION}/specialists/${id}`,
    createSpecialist: `${API}/api/${VERSION}/specialists`,
    updateSpecialist: (id) => `${API}/api/${VERSION}/specialists/${id}`,
    deleteSpecialist: (id) => `${API}/api/${VERSION}/specialists/${id}`,
    addServiceToSpecialist: `${API}/api/${VERSION}/specialists/add-service`,
    addServiceByCategoryToSpecialist: `${API}/api/${VERSION}/specialists/add-service-by-category`,
    removeServiceToSpecialist: (id) => `${API}/api/${VERSION}/specialists/remove-service/${id}`,
  },
  promos: {
    getAllPromo: `${API}/api/${VERSION}/promos`,
    getOnePromo: (id) => `${API}/api/${VERSION}/promos/${id}`,
    createPromo: `${API}/api/${VERSION}/promos`,
    updatePromo: (id) => `${API}/api/${VERSION}/promos/${id}`,
    deletePromo: (id) => `${API}/api/${VERSION}/promos/${id}`,
    addServiceToPromo: `${API}/api/${VERSION}/promos/add-service`,
    removeServiceToPromo: (id) => `${API}/api/${VERSION}/promos/remove-service/${id}`,
  },
  users: {
    getAllUser: `${API}/api/${VERSION}/users`,
    getOneUser: (id) => `${API}/api/${VERSION}/users/${id}`,
    createUser: `${API}/api/${VERSION}/users`,
    updateUser: (id) => `${API}/api/${VERSION}/users/${id}`,
    deleteUser: (id) => `${API}/api/${VERSION}/users/${id}`,
  },
};

export default endPoints;
