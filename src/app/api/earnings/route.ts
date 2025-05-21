import { formatDateForMySQL } from "@/app/utilities";
import pool from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req:NextRequest) {
    const { searchParams } = new URL(req.url || '');

    try {
        const interval = searchParams.get('interval')
        const date = searchParams.get('date');

        let queryParams = [];
    
        if (!interval) {
            return NextResponse.json({ error: "Interval is required" });
        }
       
        let query : string = '';
        
        switch (interval) {
          case "year":
             if(!date){
                query = `
                    SELECT 
                        DATE_FORMAT(date, '%Y-%m') AS month,
                        SUM(total_amount) AS total_amount
                        FROM order_hexa
                        WHERE date >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
                        GROUP BY month
                        ORDER BY month;
                `;
             } else{
                query = `
                    SELECT 
                        DATE_FORMAT(date, '%Y-%m') AS month,
                        SUM(total_amount) AS total_amount
                        FROM order_hexa
                        WHERE YEAR(date) = ?
                        GROUP BY month
                        ORDER BY month;
                `;
                queryParams = [date]
             }
            break;
    
          case "month":
             if(!date){
                query = `
                SELECT 
                    DATE_FORMAT(date, '%Y-%m-%d') AS day,
                    SUM(total_amount) AS total_amount
                    FROM order_hexa
                    WHERE date >= DATE_FORMAT(CURDATE(), '%Y-%m-01')
                    AND date <= CURDATE() 
                    GROUP BY day
                    ORDER BY day;`
             } else{
                query = `
                SELECT 
                    DATE_FORMAT(date, '%Y-%m-%d') AS day,
                    SUM(total_amount) AS total_amount
                    FROM order_hexa
                    WHERE DATE_FORMAT(date, '%m-%Y') = ?
                    GROUP BY day
                    ORDER BY day;
                `;
                queryParams = [date]
             }
            break;
    
          case "day":
            if(!date){
                query = `
                    SELECT 
                        DATE_FORMAT(CONVERT_TZ(date, '+00:00', '+05:30'), '%Y-%m-%d %H:00:00') AS hour,
                        SUM(total_amount) AS total_amount
                    FROM order_hexa
                    WHERE 
                        CONVERT_TZ(date, '+00:00', '+05:30') >= DATE_FORMAT(NOW(), '%Y-%m-%d 00:00:00')
                        AND CONVERT_TZ(date, '+00:00', '+05:30') <= CONVERT_TZ(NOW(), '+00:00', '+05:30')
                    GROUP BY hour
                    ORDER BY hour;
                `
            } else{
                query = `
                SELECT 
                CONVERT_TZ(date, '+00:00', '+05:30') AS hour, 
                SUM(total_amount) AS total_amount
                FROM order_hexa 
                WHERE DATE_FORMAT(date, '%d-%m-%Y') = ?
                GROUP BY hour ORDER BY hour;
              `;
              queryParams = [date];
            }
          break;

          case "range" : 
            query = `SELECT  
                      DATE_FORMAT(date, '%d-%m-%Y') AS day,
                      SUM(total_amount) AS total_amount
                    FROM order_hexa
                    WHERE date >= ? AND date < ?
                    GROUP BY day
                    ORDER BY day;`
                    
            const startDate = formatDateForMySQL(date.split(',')[0]);
            const endDate = formatDateForMySQL(date.split(',')[1]);

            queryParams = [startDate, endDate];
          break;
    
          default:
            return NextResponse.json({ error: "Invalid interval" });
        }
    
        const [minDateResult] = await pool.query(`SELECT MIN(date) AS min_date FROM order_hexa`);
    
        const [rows] = await pool.query(query, queryParams);
        return NextResponse.json({min:minDateResult[0].min_date, data:rows});

      } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error });
      }
}

// Handle POST requests
export async function POST() {
    return NextResponse.json({ message: 'Hello from POST' });
}