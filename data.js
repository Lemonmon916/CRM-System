const LocalStorage = {
    save: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    },
    load: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};

// 初始化資料
const initializeData = () => {
    // 初始化用戶資料
    if (!LocalStorage.load('users')) {
        const initialUsers = [
            { id: 1, name: '王小明', department: 'FINANCE', role: '財務部' },
            { id: 2, name: '李小華', department: 'SALES', role: '業務部' },
            { id: 3, name: '張小美', department: 'OPTIMIZATION', role: '優化部' }
        ];
        LocalStorage.save('users', initialUsers);
    }

    // 初始化客戶資料
    if (!LocalStorage.load('clients')) {
        const initialClients = [
            {
                id: 1,
                agencyName: "李奧貝納",
                agencyId: "AG001",
                brandName: "可口可樂",
                caseNumber: "AG001-001",
                accounts: [
                    { platform: "POPIN", accountName: "可口可樂主品牌", accountId: "POP123" },
                    { platform: "RIXBEE", accountName: "可口可樂台灣", accountId: "RIX456" }
                ]
            }
        ];
        LocalStorage.save('clients', initialClients);
    }

    // 初始化發票資料
    if (!LocalStorage.load('invoices')) {
        const initialInvoices = [
            {
                id: 1,
                invoiceNumber: "INV-202401001",
                clientName: "可口可樂",
                amount: 100000,
                status: "PENDING",
                department: "業務部",
                createdAt: new Date().toISOString()
            }
        ];
        LocalStorage.save('invoices', initialInvoices);
    }
};

// 執行初始化
initializeData();
