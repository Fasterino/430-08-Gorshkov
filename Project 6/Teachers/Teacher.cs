using System.ComponentModel;
using System.Diagnostics;
using System.Windows.Forms;

namespace Teachers
{
    public class Teacher
    {
        public static bool ValidateName(string name)
        {
            return !string.IsNullOrWhiteSpace(name) &&
               !name.Contains(' ') &&
               char.IsUpper(name[0]);
        }

        public required string LastName { get; set; }
        public required string FirstName { get; set; }
        public required string MiddleName { get; set; }
        public required string DisciplineCode { get; set; }
        public required string DisciplineName { get; set; }

        public int Validate()
        {
            if (!ValidateName(LastName))
                return 1;
            if (!ValidateName(FirstName))
                return 2;
            if (!ValidateName(MiddleName))
                return 3;
            if (string.IsNullOrWhiteSpace(DisciplineCode))
                return 4;
            if (string.IsNullOrWhiteSpace(DisciplineName))
                return 5;

            return 0;
        }
    }
}
