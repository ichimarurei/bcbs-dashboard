import connectDB from '@/lib/mongo';
import bank, { IBank } from '@/models/bank';
import cash, { ICash } from '@/models/cash';
import donate, { IDonate } from '@/models/donate';
import dayjs from 'dayjs';
import { forIn, without } from 'lodash';
import { NextRequest } from 'next/server';

const _calculate = async () => {
    const saveByDate: { [key: string]: number } = {};
    const loanByDate: { [key: string]: number } = {};
    const debtByDate: { [key: string]: number } = {};
    const donateByDate: { [key: string]: number } = {};
    let pokok = 0;
    let tabungan = 0;
    let wajib = 0;
    let tarik = 0;
    let infaq = 0;
    let manfaat = 0;
    let pinjaman = 0;
    let cicilan = 0;
    let aman = 0;

    try {
        const donates = await donate.find().sort({ crated: 'asc' }).lean<IDonate[]>();
        const transactions = await cash.find().sort({ crated: 'asc' }).lean<ICash[]>();
        const accounts: string[] = [];
        const debts: string[] = [];
        const congrats: { [key: string]: number } = {};

        // defaults...
        transactions.forEach(({ account, created }) => {
            congrats[account] = 0;

            if (dayjs().get('y') === dayjs(created).get('y')) {
                saveByDate[dayjs(created).format('MMMM')] = 0;
                loanByDate[dayjs(created).format('MMMM')] = 0;
                debtByDate[dayjs(created).format('MMMM')] = 0;
                donateByDate[dayjs(created).format('MMMM')] = 0;
            }
        });

        // savings...
        transactions
            .filter(({ category }) => category === 'saving')
            .forEach(({ type, amount, account, created }) => {
                switch (type) {
                    case 'pokok':
                        pokok += amount || 0;

                        break;
                    case 'tabungan':
                        tabungan += amount || 0;

                        break;
                    case 'wajib':
                        wajib += amount || 0;

                        break;
                    case 'tarik':
                        tarik += amount || 0;

                        break;
                    default:
                        break;
                }

                if (type === 'tarik') {
                    saveByDate[dayjs(created).format('MMMM')] -= amount || 0;
                } else {
                    saveByDate[dayjs(created).format('MMMM')] += amount || 0;
                }

                if (!accounts.includes(account)) {
                    accounts.push(account);
                }
            });

        // loans...
        transactions
            .filter(({ category }) => category === 'loan')
            .forEach(({ type, amount, account, created }) => {
                if (type === 'pinjaman') {
                    pinjaman += amount || 0;
                    congrats[account] += amount || 0;
                    loanByDate[dayjs(created).format('MMMM')] += amount || 0;
                } else if (type === 'cicilan') {
                    cicilan += amount || 0;
                    congrats[account] -= amount || 0;
                    debtByDate[dayjs(created).format('MMMM')] += amount || 0;
                }

                if (!debts.includes(account)) {
                    debts.push(account);
                }
            });

        // donations...
        donates.forEach(({ type, amount, created }) => {
            if (type === 'infaq') {
                infaq += amount || 0;
                donateByDate[dayjs(created).format('MMMM')] += amount || 0;
            } else if (type === 'manfaat') {
                manfaat += amount || 0;
                donateByDate[dayjs(created).format('MMMM')] -= amount || 0;
            }
        });

        // awesome...
        const filters = without(accounts, ...debts);

        forIn(congrats, (value, key) => {
            if (value === 0) {
                if (!filters.includes(key)) {
                    filters.push(key);
                }
            }
        });

        transactions
            .filter(({ account, category }) => filters.includes(account) && category === 'saving')
            .forEach(({ type, amount }) => {
                switch (type) {
                    case 'pokok':
                        aman += amount || 0;

                        break;
                    case 'tabungan':
                        aman += amount || 0;

                        break;
                    case 'wajib':
                        aman += amount || 0;

                        break;
                    case 'tarik':
                        aman -= amount || 0;

                        break;
                    default:
                        break;
                }
            });
    } catch (_) {}

    // summarize...
    const debit = pokok + wajib + tabungan - tarik;
    const kredit = pinjaman - cicilan;
    const donation = infaq - manfaat;
    const counts = { debit, kredit, donation, primary: aman, actual: debit + donation - kredit };

    return { pokok, tabungan, wajib, tarik, infaq, manfaat, pinjaman, cicilan, chart: { saveByDate, loanByDate, debtByDate, donateByDate }, counts };
};

export async function GET(_: NextRequest) {
    let response: Response = Response.json({ error: 'Unprocessable operation!' }, { status: 422 });

    try {
        await connectDB();
        const calculated = await _calculate();
        const notes = await bank.find().lean<IBank[]>();
        response = Response.json({ ...calculated, notes }, { status: 200 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Server error';
        response = Response.json({ error: message }, { status: 500 });
    }

    return response;
}
