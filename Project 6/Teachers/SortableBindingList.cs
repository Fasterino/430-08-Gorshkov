using System.ComponentModel;
using System.Diagnostics;

namespace Teachers
{
    public class SortableBindingList<T> : BindingList<T>
    {
        private bool _isSorted;
        private ListSortDirection _sortDirection;
        private PropertyDescriptor _sortProperty;

        protected override bool SupportsSortingCore => true;
        protected override bool IsSortedCore => _isSorted;
        protected override ListSortDirection SortDirectionCore => _sortDirection;
        protected override PropertyDescriptor SortPropertyCore => _sortProperty; // Теперь возвращает реальное значение

        public SortableBindingList() : base() { }
        public SortableBindingList(List<T> list) : base(list) {}

        protected override void ApplySortCore(PropertyDescriptor prop, ListSortDirection direction)
        {
            if (prop.PropertyType.GetInterface("IComparable") != null)
            {
                _sortProperty = prop;
                _sortDirection = direction;
                _isSorted = true;

                var items = this.Items as List<T>;
                if (items == null) return;

                items.Sort((x, y) =>
                {
                    var xValue = prop.GetValue(x);
                    var yValue = prop.GetValue(y);

                    return direction == ListSortDirection.Ascending
                        ? Comparer<object>.Default.Compare(xValue, yValue)
                        : Comparer<object>.Default.Compare(yValue, xValue);
                });

                OnListChanged(new ListChangedEventArgs(ListChangedType.Reset, -1));
            }
        }

        protected override void RemoveSortCore()
        {
            _isSorted = false;
            _sortDirection = ListSortDirection.Ascending;
            _sortProperty = null;
        }
    }
}
