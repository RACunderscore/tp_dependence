import { Application } from '../../domain/application';
import { UsageApplication } from '../../domain/usage';
import { ApplicationRepositoryPort } from '../../ports/driven/applicationRepositoryPort';
import pool from './db';

export class ApplicationRepo implements ApplicationRepositoryPort {
  
  async findAll(): Promise<Application[]> {
		const res = await pool.query(
			`
			SELECT 
				k_id AS id,
				name,
				producer
			FROM application
			ORDER BY k_id
			`
		);

		return res.rows;
	}

	async findById(id: number): Promise<Application | null> {
		const res = await pool.query(
			`
			SELECT 
				k_id AS id,
				name,
				producer
			FROM application
			WHERE k_id = $1
			LIMIT 1
			`,
			[id]
		);

		return res.rows[0] ?? null;
	}

	async save(application: Omit<Application, 'id'>): Promise<Application> {
		const res = await pool.query(
			`
			INSERT INTO application (name, producer)
			VALUES ($1, $2)
			RETURNING 
				k_id AS id,
				name,
				producer
			`,
			[application.name, application.producer]
		);

		return res.rows[0];
	}

	async findEveryUsage(id: number): Promise<UsageApplication[] | null> {
		const res = await pool.query(
			`
			SELECT
				u.k_id AS id,
				usr.k_id as key_user,
				usr.name as username,
				usr.lastname as lastname,
				usr.email as email,
				usr.phone as phone,
				usr.birthdate as birthdate,
				date_start,
				date_end,
				device_uid
			FROM app_usage u
			INNER JOIN app_user usr ON u.k_user = usr.k_id
			WHERE k_app = $1
			`,
			[id]
		);

		const array_usage_application: UsageApplication[] = res.rows.map(
			(buf_row) =>
				new UsageApplication(
					buf_row.username,
					buf_row.lastname,
					buf_row.email,
					buf_row.phone,
					buf_row.birthdate,
					buf_row.device_uid,
					buf_row.date_start,
					buf_row.date_end,
					buf_row.id
				)
		);

		return array_usage_application;
	}

	async deleteById(id: number): Promise<null> {
		const result = await pool.query(
			`
			DELETE FROM application
			WHERE k_id = $1
			RETURNING *
			`,
			[id]
		);

		// If a row was deleted, result.rows[0] will contain it
		return result.rows[0] || null;
	}

	async update(application: Application): Promise<Application> {
		const res = await pool.query(
			`
			UPDATE application
			SET 
				name = $1, 
				producer = $2
			WHERE k_id = $3
			RETURNING
				k_id AS id,
				name,
				producer
			`,
			[application.name, application.producer, application.id]
		);

		return res.rows[0];
	}
}
