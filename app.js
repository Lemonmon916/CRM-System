// 創建 UserContext
const UserContext = React.createContext(null);

// App 主元件
const App = () => {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [activeMenu, setActiveMenu] = React.useState('dashboard');
    
    React.useEffect(() => {
        // 自動創建 Lucide 圖標
        if (window.lucide) {
            window.lucide.createIcons();
        }
    });

    // 處理登入
    const handleLogin = (user) => {
        setCurrentUser(user);
    };

    // 如果未登入，顯示登入頁面
    if (!currentUser) {
        return <LoginPage onLogin={handleLogin} />;
    }

    return (
        <UserContext.Provider value={currentUser}>
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
                        <MenuItem 
                            active={activeMenu === 'invoices'}
                            onClick={() => setActiveMenu('invoices')}
                            icon="file-text"
                            text="發票管理"
                        />
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
                        {activeMenu === 'dashboard' && <DashboardPage />}
                        {activeMenu === 'clients' && <ClientsPage />}
                        {activeMenu === 'invoices' && <InvoicesPage />}
                        {activeMenu === 'budgets' && <div>預算管理內容</div>}
                    </div>
                </div>
            </div>
        </UserContext.Provider>
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
// 儀表板頁面
const DashboardPage = () => {
    const currentUser = React.useContext(UserContext);
    const clients = LocalStorage.load('clients') || [];
    const invoices = LocalStorage.load('invoices') || [];

    return (
        <div>
            <h1 className="text-2xl font-bold text-blue-900 mb-6">歡迎，{currentUser.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">客戶總數</h2>
                    <p className="text-3xl text-blue-600">{clients.length}</p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">待處理發票</h2>
                    <p className="text-3xl text-yellow-600">
                        {invoices.filter(inv => inv.status === 'PENDING').length}
                    </p>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <h2 className="text-lg font-semibold mb-2">本月發票總額</h2>
                    <p className="text-3xl text-green-600">
                        ${invoices.reduce((sum, inv) => sum + inv.amount, 0).toLocaleString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

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
            <div className="bg-white rounded-lg shadow overflow-hidden">
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

// 發票管理頁面
const InvoicesPage = () => {
    const [invoices, setInvoices] = React.useState(LocalStorage.load('invoices') || []);
    const currentUser = React.useContext(UserContext);
    const [showAddModal, setShowAddModal] = React.useState(false);

    const handleApprove = (invoiceId) => {
        const updatedInvoices = invoices.map(invoice => 
            invoice.id === invoiceId 
                ? {...invoice, status: 'APPROVED', approvedBy: currentUser.name, approvedAt: new Date().toISOString()}
                : invoice
        );
        setInvoices(updatedInvoices);
        LocalStorage.save('invoices', updatedInvoices);
    };

    const handleReject = (invoiceId) => {
        const updatedInvoices = invoices.map(invoice => 
            invoice.id === invoiceId 
                ? {...invoice, status: 'REJECTED', rejectedBy: currentUser.name, rejectedAt: new Date().toISOString()}
                : invoice
        );
        setInvoices(updatedInvoices);
        LocalStorage.save('invoices', updatedInvoices);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-blue-900">發票管理</h1>
                {currentUser.department !== 'FINANCE' && (
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <i data-lucide="plus" className="w-4 h-4 mr-2"></i>
                        開立發票
                    </button>
                )}
            </div>

            <div className="bg-white rounded-lg shadow">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">發票號碼</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">客戶名稱</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">金額</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">狀態</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">開立部門</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-blue-800 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invoices.map((invoice) => (
                            <tr key={invoice.id} className="hover:bg-blue-50">
                                <td className="px-6 py-4 whitespace-nowrap">{invoice.invoiceNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{invoice.clientName}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${invoice.amount.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 py-1 text-xs rounded-full ${
                                        invoice.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                        invoice.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {invoice.status === 'PENDING' ? '待審核' :
                                         invoice.status === 'APPROVED' ? '已核准' : '已拒絕'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{invoice.department}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex space-x-2">
                                       {currentUser.department === 'FINANCE' && invoice.status === 'PENDING' ? (
    <div className="flex space-x-2">
        <button 
            onClick={() => handleApprove(invoice.id)}
            className="text-green-600 hover:text-green-800"
        >
            <i data-lucide="check" className="w-4 h-4"></i>
        </button>
        <button
            onClick={() => handleReject(invoice.id)}
            className="text-red-600 hover:text-red-800"
        >
            <i data-lucide="x" className="w-4 h-4"></i>
        </button>
    </div>
) : (
    <button className="text-blue-600 hover:text-blue-800">
        <i data-lucide="eye" className="w-4 h-4"></i>
    </button>
)}
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
        </div>
    );
};

// 渲染應用
ReactDOM.render(<App />, document.getElementById('root'));
