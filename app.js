/* 將檔名輸入為 "app.js" */

const App = () => {
    // 示例數據
    const clients = [
        {
            agencyName: "李奧貝納",
            agencyId: "AG001",
            brandName: "可口可樂",
            caseNumber: "AG001-001",
            accounts: [
                { platform: "POPIN", accountName: "可口可樂主品牌", accountId: "POP123" },
                { platform: "RIXBEE", accountName: "可口可樂台灣", accountId: "RIX456" }
            ]
        },
        {
            agencyName: "李奧貝納",
            agencyId: "AG001",
            brandName: "雀巢",
            caseNumber: "AG001-002",
            accounts: [
                { platform: "POPIN", accountName: "雀巢咖啡", accountId: "POP789" },
                { platform: "RIXBEE", accountName: "雀巢台灣", accountId: "RIX012" }
            ]
        }
    ];

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-900">客戶管理系統</h1>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-bold text-blue-900 mb-4">品牌客戶列表</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">案號</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">代理商</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">品牌名稱</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">PopIn 帳號</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Rixbee 帳號</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {clients.map((client, index) => (
                                <tr key={index} className="hover:bg-blue-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
                                            {client.caseNumber}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{client.agencyName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{client.brandName}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            <div>{client.accounts[0].accountName}</div>
                                            <div className="text-gray-500">ID: {client.accounts[0].accountId}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm">
                                            <div>{client.accounts[1].accountName}</div>
                                            <div className="text-gray-500">ID: {client.accounts[1].accountId}</div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
