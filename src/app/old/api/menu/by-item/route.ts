// import pool from "@/lib/db";
import { formatDateForMySQL } from "@/app/old/utilities";
import pool from "@/app/old/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
  
    const { searchParams } = new URL(req.url || '')
    const id = searchParams.get('id');
    const interval = searchParams.get('interval');
    const date: string  = searchParams.get('date');
    let queryParams = [id, date];

    if (!id) {
        return NextResponse.json({ error: 'Menu ID is required' }, { status: 400 });
    }


      if(!date){
        const yr = new Date().getFullYear();
        const mnt = (Number(new Date().getMonth()) < 10 ? '0' : '')+(Number(new Date().getMonth()) + 1);
        const day = (Number(new Date().getDate()) < 10 ? '0' : '')+(Number(new Date().getDate()));
        switch (interval) {
          case 'year':
            const yearParam = yr;
            queryParams = [id, yearParam.toString()];
            break;
          case 'month':
            const monthParam =  mnt+'-'+yr;
            queryParams = [id, monthParam];
            break;
          case 'day':
            const dayParam = day+'-'+mnt+'-'+yr;    
            queryParams = [id, dayParam];        
            break;
          case 'range':
            const rangeParam = date.split(',');
            queryParams = [id, rangeParam[0], rangeParam[1]];
            break;
          default:
            break;
        }
      }else {
         switch (interval) {
            case 'range':
              const startDate = formatDateForMySQL(date.split(',')[0]);
              const endDate = formatDateForMySQL(date.split(',')[1]);
              queryParams = [id, startDate, endDate];
              break;
         }
      }

      let query : string = '';

      switch (interval) {
        case 'year':
              query = `
              SELECT
                DATE_FORMAT(oh.date, '%Y-%m') AS month,
                SUM(bh.quantity) AS total_quantity,
                SUM(bh.price * bh.quantity) AS total_revenue
              FROM billing_hexa bh
              JOIN menu_hexa mh ON bh.menu_id = mh.id
              JOIN order_hexa oh ON bh.order_id = oh.id
              WHERE mh.id = ? 
              AND YEAR(oh.date) = ?
              GROUP BY month
              ORDER BY month;
              `
          break;

        case 'month' : 
          query = `
            SELECT
              DATE_FORMAT(oh.date, '%d-%m-%Y') AS day,
              SUM(bh.quantity) AS total_quantity,
              SUM(bh.price * bh.quantity) AS total_revenue
              FROM billing_hexa bh
              JOIN menu_hexa mh ON bh.menu_id = mh.id
              JOIN order_hexa oh ON bh.order_id = oh.id
              WHERE mh.id = ? 
              AND DATE_FORMAT(oh.date, '%m-%Y') = ?
              GROUP BY day
              ORDER BY day;
          `
        break;

        case 'day' : 
          query = `
            SELECT
              CONVERT_TZ(oh.date, '+00:00', '+05:30') AS hour,
              SUM(bh.quantity) AS total_quantity,
              SUM(bh.price * bh.quantity) AS total_revenue
              FROM billing_hexa bh
              JOIN menu_hexa mh ON bh.menu_id = mh.id
              JOIN order_hexa oh ON bh.order_id = oh.id
              WHERE mh.id = ? 
              AND DATE_FORMAT(oh.date, '%d-%m-%Y') = ?
              GROUP BY hour
              ORDER BY hour;
          `
        break;

        case 'range' :
          query = 
            `SELECT
                DATE_FORMAT(oh.date, '%Y-%m-%d') AS day,
                SUM(bh.quantity) AS total_quantity,
                SUM(bh.price * bh.quantity) AS total_revenue
            FROM billing_hexa bh
            JOIN menu_hexa mh ON bh.menu_id = mh.id
            JOIN order_hexa oh ON bh.order_id = oh.id
            WHERE mh.id = ?
              AND DATE(oh.date) BETWEEN ? AND ?
            GROUP BY day
            ORDER BY day;`
          break
      
        default:
          break;
      }
  try {
      const [rows] = await pool.query(query, queryParams);

      return NextResponse.json(rows);
    
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: error, message: JSON.stringify(queryParams)  }, { status: 500});
  }

}