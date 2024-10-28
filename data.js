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
                    {activeMenu === 'dashboard' && <Dashboard />}
                    {activeMenu === 'clients' && <ClientsPage />}
                    {activeMenu === 'invoices' && <InvoicesPage />}
                    {activeMenu === 'budgets' && <BudgetsPage />}
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
        <i className={`lucide lucide-${icon} mr-2`}></i>
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

ReactDOM.render(<App />, document.getElementById('root'));
