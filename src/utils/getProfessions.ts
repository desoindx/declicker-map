export const getProfessions = async () =>
  fetch(encodeURI('https://api.airtable.com/v0/appXVpwKTp3eNKFBT/tbl3hRRceFwkXDf3s'), {
    headers: {
      Authorization: `Bearer ${process.env.AIRTABLE_TOKEN}`,
    },
  })
    .then((response) => response.json())
    .then((body) =>
      body.records
        .filter((record: any) => record.fields.Profession_Name)
        .sort((a: any, b: any) => a.fields.Profession_Name.localeCompare(b.fields.Profession_Name))
        .map((record: any) => ({
          label: record.fields.Profession_Name,
          value: record.id,
        }))
    )
