// 將檔名輸入為 "data.js"

const LocalStorage = {
    // 儲存資料
    save: (key, data) => {
        localStorage.setItem(key, JSON.stringify(data));
    },
    // 讀取資料
    load: (key) => {
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    }
};

// 初始化資料
const initializeData = () => {
    // 檢查是否已有資料
    if (!LocalStorage.load('users')) {
        // 初始化用戶資料
        const initialUsers = [
            { id: 1, name: '王小明', department: 'FINANCE', role: '財務部' },
            { id: 2, name: '李小華', department: 'SALES', role: '業務部' },
            { id: 3, name: '張小美', department: 'OPTIMIZATION', role: '優化部' }
        ];
        LocalStorage.save('users', initialUsers);
    }

    if (!LocalStorage.load('clients')) {
        // 初始化客戶資料
        const initialClients = [
            {
                id: 1,
                agencyName: "李奧貝納",
                agencyId: "AG001",
                brandName: "可口可樂",
                caseNumber: "AG001-001",
                iabCategory: "Food & Beverage",
                accounts: [
                    { platform: "POPIN", accountName: "可口可樂主品牌", accountId: "POP123" },
                    { platform: "RIXBEE", accountName: "可口可樂台灣", accountId: "RIX456" }
                ]
            }
        ];
        LocalStorage.save('clients', initialClients);
    }

    if (!LocalStorage.load('budgets')) {
        // 初始化預算資料
        const initialBudgets = [
            {
                clientId: 1,
                month: '2024-01',
                platforms: {
                    POPIN: { planned: 100000, actual: 98500 },
                    RIXBEE: { planned: 80000, actual: 82000 }
                }
            }
        ];
        LocalStorage.save('budgets', initialBudgets);
    }
};

// 初始化資料
initializeData();
