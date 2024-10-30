package com.fpoly.datn.entity;

import com.fpoly.datn.model.dto.ChartDTO;
import lombok.*;
import lombok.experimental.FieldDefaults;

import javax.persistence.*;
import java.sql.Timestamp;

@SqlResultSetMappings(
        value = {
                @SqlResultSetMapping(
                        name = "chartCategoryDTO",
                        classes = @ConstructorResult(
                                targetClass = ChartDTO.class,
                                columns = {
                                        @ColumnResult(name = "label",type = String.class),
                                        @ColumnResult(name = "value",type = Integer.class)
                                }
                        )
                )
        }
)
@NamedNativeQuery(
        name = "getProductOrderCategories",
        resultSetMapping = "chartCategoryDTO",
        query = "select  c.name as label, count(o.quantity) as value from category c " +
                "inner join product_category pc on pc.category_id = c.id " +
                "inner join product p on p.id = pc.product_id " +
                "inner join orders o on o.product_id = p.id " +
                "where o.status = 3 " +
                "group by c.id "
)
@AllArgsConstructor
@NoArgsConstructor
@Setter
@Getter
@Entity
@Table(name = "category")
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    long id;
    @Column(name = "name",nullable = false,length = 300)
    String name;
    @Column(name = "slug",nullable = false)
    String slug;
//    @Column(name = "description")
//    private String description;
    @Column(name = "orders")
    int order;
    @Column(name = "status",columnDefinition = "BOOLEAN")
    boolean status;
    @Column(name = "created_at")
    Timestamp createdAt;
    @Column(name = "modified_at")
    Timestamp modifiedAt;

//    @ManyToMany(mappedBy = "categories")
//    private List<Product> products;
}
