export default function InputField({ label, type = "text", name, value, onChange, placeholder, error }) {
  return (
    <div className="w-full">
      <label className="block text-gray-700 text-xs font-bold mb-1 ml-1 uppercase">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl bg-gray-50 border ${
          error ? 'border-red-500 ring-1 ring-red-100' : 'border-gray-200'
        } focus:outline-none focus:border-amber-500 text-sm transition-all`}
      />
      {/* Tampilan Pesan Error */}
      {error && (
        <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold animate-bounce">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}