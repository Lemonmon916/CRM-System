// App 主元件
const App = () => {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [activeMenu, setActiveMenu] = React.useState('dashboard');
    
    // 處理登入
    const handleLogin = (user) => {
        setCurrentUser(user);
    };

    // 如果未登入，顯示登入頁面
    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <div className="flex h-screen bg-gray-100">
            {/* 左側選單 */}
            <div className="w-64 bg-blue-800 text-white">
                <div className="p-4 border-b border-blue-700">
                    <h1 className="text-lg font-bold">客戶管理系統</h1>
                    <p className="text-sm text-blue-300 mt-1">{currentUser.name} - {currentUser.role}</p>
                </div>
                <nav className="mt-4">
                    <MenuItem 
                        active={activeMenu === 'dashboard'}
                        onClick={() => setActiveMenu('dashboard')}
                        icon="home"
                        text="儀表板"
                    />
                    <MenuItem 
                        active={activeMenu === 'clients'}
                        onClick={() => setActiveMenu('clients')}
                        icon="users"
                        text="客戶管理"
                    />
                    {currentUser.department === 'FINANCE' && (
                        <MenuItem 
                            active={activeMenu === 'invoices'}
                            onClick={() => setActiveMenu('invoices')}
                            icon="file-text"
                            text="發票管理"
                        />
                    )}
                    <MenuItem 
                        active={activeMenu === 'budgets'}
                        onClick={() => setActiveMenu('budgets')}
                        icon="dollar-sign"
                        text="預算管理"
                    />
                </nav>
            </div>

            {/* 主要內容區域 */}
            <div className="flex-1 overflow-auto">
                <div className="p-6">
                    {activeMenu === 'dashboard' && <div>儀表板內容</div>}
                    {activeMenu === 'clients' && <ClientsPage />}
                    {activeMenu === 'invoices' && <div>發票管理內容</div>}
                    {activeMenu === 'budgets' && <div>預算管理內容</div>}
                </div>
            </div>
        </div>
    );
};

// 選單項目元件
const MenuItem = ({ active, onClick, icon, text }) => (
    <button
        className={`w-full flex items-center px-4 py-2 text-sm ${
            active ? 'bg-blue-700' : 'hover:bg-blue-700'
        }`}
        onClick={onClick}
    >
        <i data-lucide={icon} className="w-4 h-4 mr-2"></i>
        {text}
    </button>
);

// 登入頁面元件
const LoginPage = ({ onLogin }) => {
    const users = LocalStorage.load('users');

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md w-96">
                <h1 className="text-2xl font-bold text-center mb-6">系統登入</h1>
                <div className="space-y-4">
                    {users.map(user => (
                        <button
                            key={user.id}
                            className="w-full p-3 bg-blue-600 text-white rounded hover:bg-blue-700"
                            onClick={() => onLogin(user)}
                        >
                            {user.name} - {user.role}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

// 客戶管理頁面
const ClientsPage = () => {
    const [clients, setClients] = React.useState(LocalStorage.load('clients') || []);
    const [showAddModal, setShowAddModal] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    // 篩選客戶
    const filteredClients = clients.filter(client => 
        client.brandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.agencyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 新增客戶
    const handleAddClient = (newClient) => {
        const updatedClients = [...clients, {
            ...newClient,
            id: clients.length + 1,
            caseNumber: `AG${String(clients.length + 1).padStart(3, '0')}-001`
        }];
        setClients(updatedClients);
        LocalStorage.save('clients', updatedClients);
        setShowAddModal(false);
    };

    return (
        <div>
            {/* 頁面標題和操作區 */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-900">客戶管理</h1>
                <div className="flex space-x-4">
                    {/* 搜尋框 */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="搜尋客戶..."
                            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i data-lucide="search" className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"></i>
                    </div>
                    {/* 新增客戶按鈕 */}
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <i data-lucide="plus" className="w-4 h-4 mr-2"></i>
                        新增客戶
                    </button>
                </div>
            </div>

            {/* 客戶列表 */}
            <div className="bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">案號</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">代理商</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">品牌名稱</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">PopIn 帳號</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">Rixbee 帳號</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredClients.map((client) => (
                            <tr key={client.id} className="hover:bg-blue-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 py-1 text-sm text-blue-700 bg-blue-100 rounded-full">
                                        {client.caseNumber}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{client.agencyName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{client.brandName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {client.accounts.find(acc => acc.platform === "POPIN") && (
                                        <div className="text-sm">
                                            <div>{client.accounts.find(acc => acc.platform === "POPIN").accountName}</div>
                                            <div className="text-gray-500">ID: {client.accounts.find(acc => acc.platform === "POPIN").accountId}</div>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {client.accounts.find(acc => acc.platform === "RIXBEE") && (
                                        <div className="text-sm">
                                            <div>{client.accounts.find(acc => acc.platform === "RIXBEE").accountName}</div>
                                            <div className="text-gray-500">ID: {client.accounts.find(acc => acc.platform === "RIXBEE").accountId}</div>
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <i data-lucide="edit" className="w-4 h-4"></i>
                                        </button>
                                        <button className="text-blue-600 hover:text-blue-800">
                                            <i data-lucide="eye" className="w-4 h-4"></i>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* 新增客戶 Modal */}
            {showAddModal && (
                <AddClientModal
                    onClose={() => setShowAddModal(false)}
                    onAdd={handleAddClient}
                />
            )}
        </div>
    );
};

// 新增客戶 Modal 元件
const AddClientModal = ({ onClose, onAdd }) => {
    const [formData, setFormData] = React.useState({
        agencyName: '',
        brandName: '',
        accounts: [
            { platform: 'POPIN', accountName: '', accountId: '' },
            { platform: 'RIXBEE', accountName: '', accountId: '' }
        ]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onAdd(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg w-[600px]">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">新增客戶</h2>
                    <button onClick={onClose}>
                        <i data-lucide="x" className="w-6 h-6"></i>
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">代理商名稱</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            value={formData.agencyName}
                            onChange={(e) => setFormData({...formData, agencyName: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">品牌名稱</label>
                        <input
                            type="text"
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                            value={formData.brandName}
                            onChange={(e) => setFormData({...formData, brandName: e.target.value})}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">PopIn 帳號</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="帳號名稱"
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.accounts[0].accountName}
                                onChange={(e) => {
                                    const newAccounts = [...formData.accounts];
                                    newAccounts[0].accountName = e.target.value;
                                    setFormData({...formData, accounts: newAccounts});
                                }}
                                required
                            />
                            <input
                                type="text"
                                placeholder="帳號 ID"
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.accounts[0].accountId}
                                onChange={(e) => {
                                    const newAccounts = [...formData.accounts];
                                    newAccounts[0].accountId = e.target.value;
                                    setFormData({...formData, accounts: newAccounts});
                                }}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Rixbee 帳號</label>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="帳號名稱"
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.accounts[1].accountName}
                                onChange={(e) => {
                                    const newAccounts = [...formData.accounts];
                                    newAccounts[1].accountName = e.target.value;
                                    setFormData({...formData, accounts: newAccounts});
                                }}
                                required
                            />
                            <input
                                type="text"
                                placeholder="帳號 ID"
                                className="px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                                value={formData.accounts[1].accountId}
                                onChange={(e) => {
                                    const newAccounts = [...formData.accounts];
                                    newAccounts[1].accountId = e.target.value;
                                    setFormData({...formData, accounts: newAccounts});
                                }}
                                required
                            />
                        </div>
                    </div
</div>
                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                        >
                            新增
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
