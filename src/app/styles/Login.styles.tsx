import colors from "../../../public/styles/colors"; // Ensure this path is correct

export const inputContainerStyle = `relative border-b-2 border-gray-300 focus-within:border-${colors.success.main}`;
export const inputStyle = `block w-full pl-10 pr-3 py-2 bg-transparent placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-0 sm:text-sm`;
export const iconStyle = `absolute right-0 inset-y-2.5 flex items-center `;

export const modalBackdropStyle = `fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-50 flex justify-center items-center`;
export const modalStyle = `bg-white rounded-lg shadow-lg p-6 space-y-4`;
