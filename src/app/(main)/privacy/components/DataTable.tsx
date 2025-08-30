import { PrivacyDataItem } from "../privacy-data";

interface DataTableProps {
  data: PrivacyDataItem[];
}

export default function DataTable({ data }: DataTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-border rounded-lg">
        <thead>
          <tr className="bg-muted">
            <th className="border border-border px-4 py-3 text-left font-semibold">구분</th>
            <th className="border border-border px-4 py-3 text-left font-semibold">수집 항목</th>
            <th className="border border-border px-4 py-3 text-left font-semibold">수집 목적</th>
            <th className="border border-border px-4 py-3 text-left font-semibold">보유 기간</th>
            <th className="border border-border px-4 py-3 text-left font-semibold">필수 여부</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="hover:bg-muted/50">
              <td className="border border-border px-4 py-3 font-medium">{item.category}</td>
              <td className="border border-border px-4 py-3">
                <ul className="list-disc list-inside space-y-1">
                  {item.items.map((subItem, subIndex) => (
                    <li key={subIndex} className="text-sm">{subItem}</li>
                  ))}
                </ul>
              </td>
              <td className="border border-border px-4 py-3 text-sm">{item.purpose}</td>
              <td className="border border-border px-4 py-3 text-sm">{item.retention}</td>
              <td className="border border-border px-4 py-3">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  item.required === "필수" ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200" :
                  item.required === "선택" ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200" :
                  "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
                }`}>
                  {item.required}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
