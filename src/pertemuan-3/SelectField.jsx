export default function SelectField({ label, name, value, onChange, options, error }) {
  return (
    <div className="w-full">
      <label className="block text-gray-700 text-xs font-bold mb-1.5 ml-1 uppercase tracking-wide">
        {label}
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-2.5 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-100 text-sm transition-all appearance-none cursor-pointer"
        >
          <option value="">Pilih</option>
          {options.map((item, index) => (
            <option key={index} value={item}>{item}</option>
          ))}
        </select>
        {/* Panah kustom */}
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-400">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      {error && <p className="text-red-500 text-[10px] mt-1 ml-1 font-bold uppercase">{error}</p>}
    </div>
  );
}