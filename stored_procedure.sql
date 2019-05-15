DELIMITER $$

drop procedure if exists `customer` $$
create procedure `customer` (email varchar(20))
	begin
	  select * from customer where EmailID=email;
	end $$

DELIMITER ;