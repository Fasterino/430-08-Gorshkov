using System.ComponentModel;
using System.Diagnostics;
using System.Text.Json;
using System.Windows.Forms;

namespace Teachers
{
    public partial class TeachersForm : Form
    {
        private BindingSource bindingSource = new();
        private bool changed = false;

        public TeachersForm()
        {
            InitializeComponent();
            dataGridView1.AutoGenerateColumns = false;
            bindingSource.DataSource = new SortableBindingList<Teacher>();
            dataGridView1.DataSource = bindingSource;
        }

        public SortableBindingList<Teacher> GetSource()
        {
            return (SortableBindingList<Teacher>)bindingSource.DataSource;
        }

        public void SetSource(List<Teacher> teachers)
        {
            bindingSource.DataSource = new SortableBindingList<Teacher>(teachers);
        }

        private void ValidateErrorMessage(int index, string where)
        {
            MessageBox.Show($"Нельзя сохранить данные, так как в строке {index + 1} в {where} допущена ошибка", "Ошибка валидации");
        }

        private void button1_Click(object sender, EventArgs e)
        {
            Save();
        }

        private void Save()
        {

            for (int i = 0; i < bindingSource.Count; i++)
            {
                int error = GetSource()[i].Validate();

                switch (error)
                {
                    case 1:
                        ValidateErrorMessage(i, "фамилии");
                        return;
                    case 2:
                        ValidateErrorMessage(i, "имени");
                        return;
                    case 3:
                        ValidateErrorMessage(i, "отчестве");
                        return;
                    case 4:
                        ValidateErrorMessage(i, "коде дисциплины");
                        return;
                    case 5:
                        ValidateErrorMessage(i, "имени дисциплины");
                        return;

                }
            }

            SaveFileDialog saveDialog = new()
            {
                FileName = "prog_data.json",
                Filter = "Файл программы (*.json)|*.json"
            };
            if (saveDialog.ShowDialog() == DialogResult.OK)
            {
                Debug.WriteLine(saveDialog.FileName);
                var json = JsonSerializer.Serialize(GetSource());
                File.WriteAllText(saveDialog.FileName, json);
                SetChanged(false);
            }
        }

        private void button2_Click(object sender, EventArgs e)
        {
            if (!UnsavedDataDialog())
                return;

            OpenFileDialog openDialog = new()
            {
                Filter = "Файл программы (*.json)|*.json"
            };
            if (openDialog.ShowDialog() == DialogResult.OK)
            {
                string json = File.ReadAllText(openDialog.FileName);
                try
                {
                    var teachers = JsonSerializer.Deserialize<List<Teacher>>(json);
                    if (teachers == null)
                        throw new Exception("Пустой объект");
                    SetSource(teachers);
                    SetChanged(false);
                }
                catch
                {
                    MessageBox.Show("Не удалось открыть файл программы", "Ошибка");
                }
            }
        }


        public bool UnsavedDataDialog()
        {
            if (!changed)
                return true;

            var result = MessageBox.Show("У вас остались несохраненные данные, вы уверены что хотите продолжить?", "Внимание", MessageBoxButtons.OKCancel);
            return result == DialogResult.OK;
        }


        private void dataGridView1_ColumnHeaderMouseClick(object sender, DataGridViewCellMouseEventArgs e)
        {
            string propertyName = dataGridView1.Columns[e.ColumnIndex].DataPropertyName;
            string direction = GetSortDirection(propertyName) == 0 ? "ASC" : "DESC";
            bindingSource.Sort = $"{propertyName} {direction}";
        }

        private ListSortDirection GetSortDirection(string propertyName)
        {
            if (bindingSource.Sort?.Contains(propertyName) ?? false)
            {
                string currentDirection = bindingSource.Sort.Split(' ')[1];
                return currentDirection == "ASC" ? ListSortDirection.Descending : ListSortDirection.Ascending;
            }
            return ListSortDirection.Ascending;
        }

        private void dataGridView1_Sorted(object sender, EventArgs e)
        {
            DataChanged();
        }

        private void dataGridView1_CellBeginEdit(object sender, DataGridViewCellCancelEventArgs e)
        {
            DataChanged();
        }


        private void DataChanged()
        {
            SetChanged(true);
        }

        public void SetChanged(bool value)
        {
            if (changed == value) return;
            changed = value;

            if (changed)
                Text += " *";
            else
                Text = Text.Substring(0, Text.Length - 2);
        }

        private void TeachersForm_FormClosing(object sender, FormClosingEventArgs e)
        {
            if (!UnsavedDataDialog())
                e.Cancel = true;
        }
    }
}
